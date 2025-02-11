package template

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"reflect"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
	"github.com/highercomve/go-react-ssr/modules/lib/env"
	"rogchap.com/v8go"

	"github.com/dannyvankooten/extemplate"
	"github.com/labstack/echo/v4"
)

const (
	minute  = 1
	hour    = minute * 60
	day     = hour * 24
	month   = day * 30
	year    = day * 365
	quarter = year / 4
)

const textEncoderPolyfill = `function TextEncoder(){} TextEncoder.prototype.encode=function(string){var octets=[],length=string.length,i=0;while(i<length){var codePoint=string.codePointAt(i),c=0,bits=0;codePoint<=0x7F?(c=0,bits=0x00):codePoint<=0x7FF?(c=6,bits=0xC0):codePoint<=0xFFFF?(c=12,bits=0xE0):codePoint<=0x1FFFFF&&(c=18,bits=0xF0),octets.push(bits|(codePoint>>c)),c-=6;while(c>=0){octets.push(0x80|((codePoint>>c)&0x3F)),c-=6}i+=codePoint>=0x10000?2:1}return octets};function TextDecoder(){} TextDecoder.prototype.decode=function(octets){var string="",i=0;while(i<octets.length){var octet=octets[i],bytesNeeded=0,codePoint=0;octet<=0x7F?(bytesNeeded=0,codePoint=octet&0xFF):octet<=0xDF?(bytesNeeded=1,codePoint=octet&0x1F):octet<=0xEF?(bytesNeeded=2,codePoint=octet&0x0F):octet<=0xF4&&(bytesNeeded=3,codePoint=octet&0x07),octets.length-i-bytesNeeded>0?function(){for(var k=0;k<bytesNeeded;){octet=octets[i+k+1],codePoint=(codePoint<<6)|(octet&0x3F),k+=1}}():codePoint=0xFFFD,bytesNeeded=octets.length-i,string+=String.fromCodePoint(codePoint),i+=bytesNeeded+1}return string};`

const messageChannelPolyfill = `if(typeof MessageChannel==="undefined"){var MessageChannel=function(){this.port1={postMessage:function(msg){setTimeout(()=>{this.onmessage&&this.onmessage({data:msg})},0)},onmessage:null},this.port2={postMessage:function(msg){setTimeout(()=>{this.onmessage&&this.onmessage({data:msg})},0)},onmessage:null}}}`

const processPolyfill = `var process = {env: {NODE_ENV: "production"}};`

// GeneralPayload structure to extend any payload
type GeneralPayload struct {
	Payload          interface{}
	Template         string
	TemplateID       string
	ServerURL        string
	Component        string
	InnerHtmlContent template.HTML
	RSCContent       string
}

var functions template.FuncMap = template.FuncMap{
	"notNil":        notNil,
	"convertToJson": convertToJson,
}

func GetFiles(root, extension string) ([]string, error) {
	var files []string

	err := filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		// Check if the file has a .jsx extension
		if !d.IsDir() && filepath.Ext(path) == extension {
			files = append(files, path)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return files, nil
}

func buildClientComponents() error {
	fmt.Println("Building client Javascript")

	jsFolder := "./frontend/app"
	filesJSX, err := GetFiles(jsFolder, ".jsx")
	if err != nil {
		return err
	}

	filesTSX, err := GetFiles(jsFolder, ".tsx")
	if err != nil {
		return err
	}

	allFiles := append(filesJSX, filesTSX...)
	allFiles = append(allFiles, "./frontend/app.js")

	builds := esbuild.Build(esbuild.BuildOptions{
		EntryPoints:    allFiles,
		Bundle:         true,
		Write:          true,
		Splitting:      true,
		AllowOverwrite: true,
		AssetNames:     "[name]-[hash]",
		Outdir:         "build",
		Format:         esbuild.FormatESModule,
		Platform:       esbuild.PlatformBrowser,
		Target:         esbuild.ESNext,
		Loader: map[string]esbuild.Loader{
			".jsx":  esbuild.LoaderJSX,
			".tsx":  esbuild.LoaderTSX,
			".js":   esbuild.LoaderJSX,
			".scss": esbuild.LoaderLocalCSS,
		},
	})

	if len(builds.Errors) > 0 {
		return fmt.Errorf("error on esbuild: %v", builds.Errors)
	}

	for _, file := range builds.OutputFiles {
		fmt.Println("Created file:", file.Path)
	}

	return nil
}

func buildServerComponents(jsFolder, jsOutput string) (map[string]string, error) {
	fmt.Println("Building server Javascript")
	result := map[string]string{}

	filesJSX, err := GetFiles(jsFolder, ".jsx")
	if err != nil {
		return result, err
	}

	filesTSX, err := GetFiles(jsFolder, ".tsx")
	if err != nil {
		return result, err
	}

	// filesJS, err := GetFiles(jsFolder, ".js")
	// if err != nil {
	// 	return result, err
	// }

	allFiles := append(filesJSX, filesTSX...)

	builds := esbuild.Build(esbuild.BuildOptions{
		EntryPoints: allFiles,
		Bundle:      true,
		Write:       false,
		Outdir:      "build",
		Format:      esbuild.FormatESModule,
		Platform:    esbuild.PlatformBrowser,
		Target:      esbuild.ESNext,
		Banner: map[string]string{
			"js": processPolyfill + messageChannelPolyfill + textEncoderPolyfill,
		},
		Loader: map[string]esbuild.Loader{
			".jsx":  esbuild.LoaderJSX,
			".js":   esbuild.LoaderJSX,
			".tsx":  esbuild.LoaderTSX,
			".scss": esbuild.LoaderLocalCSS,
		},
	})

	if len(builds.Errors) > 0 {
		return result, fmt.Errorf("error on esbuild: %v", builds.Errors)
	}

	for _, file := range builds.OutputFiles {
		if strings.Contains(file.Path, jsOutput) {
			paths := strings.Split(file.Path, jsOutput)
			path := ""
			if len(paths) >= 2 {
				path = strings.Join(paths[1:], "")
			}
			result[path] = string(file.Contents)
			fmt.Println("Server file built in:", path)

		}
	}

	return result, nil
}

type ReactRenderer struct {
	ctx     *v8go.Context
	content string
	name    string
}

func (renderer *ReactRenderer) Render(data interface{}) (template.HTML, string, error) {
	params, err := json.MarshalIndent(data, "", "	")
	if err != nil {
		return "", "", err
	}

	_, err = renderer.ctx.RunScript(renderer.content, renderer.name)
	if err != nil {
		fmt.Printf("errror on running component %+v\n", err)
		return "", "", err
	}

	_, err = renderer.ctx.RunScript("globalThis.PROPS = "+string(params), "params.js")
	if err != nil {
		fmt.Printf("errror on setting props %+v\n", err)
		return "", "", err
	}

	val, err := renderer.ctx.RunScript("Render()", "render.js")
	if err != nil {
		fmt.Printf("errror on render react %+v\n", err)
		return "", "", err
	}

	html := template.HTML(val.String())

	val, err = renderer.ctx.RunScript("RenderRSC()", "render.js")
	if err != nil {
		fmt.Printf("errror on render react %+v\n", err)
		return "", "", err
	}

	jsx := val.String()

	return html, jsx, nil
}

func (renderer *ReactRenderer) RenderRSC(data interface{}) (string, error) {
	params, err := json.MarshalIndent(data, "", "	")
	if err != nil {
		return "", err
	}

	_, err = renderer.ctx.RunScript(renderer.content, renderer.name)
	if err != nil {
		fmt.Printf("errror on running component %+v\n", err)
		return "", err
	}

	_, err = renderer.ctx.RunScript("globalThis.PROPS = "+string(params), "params.js")
	if err != nil {
		fmt.Printf("errror on setting props %+v\n", err)
		return "", err
	}

	val, err := renderer.ctx.RunScript("RenderRSC()", "render.js")
	if err != nil {
		fmt.Printf("errror on render react %+v\n", err)
		return "", err
	}

	jsx := val.String()

	return jsx, nil
}

// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates  *extemplate.Extemplate
	reactFiles map[string]string
	reactCache map[string]*ReactRenderer
}

// CreateTemplateRenderer return a renderer with all the templates views
func CreateTemplateRenderer() *TemplateRenderer {
	xt := extemplate.New().Funcs(functions)
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	err = xt.ParseDir(dir+"/templates/", []string{".html"})
	if err != nil {
		log.Fatal(err)
	}

	reactFiles, err := buildServerComponents("./frontend/server", "build/")
	if err != nil {
		log.Fatal(err)
	}

	err = buildClientComponents()
	if err != nil {
		log.Fatal(err)
	}

	renderer := &TemplateRenderer{
		templates:  xt,
		reactFiles: reactFiles,
	}

	renderer.reactCache = make(map[string]*ReactRenderer)

	return renderer
}

// Render renders a template document
func (t *TemplateRenderer) Render(
	w io.Writer,
	name string,
	data interface{},
	c echo.Context,
) error {
	var err error
	values := strings.Split(name, ":")
	tmplName := name
	component := ""
	htmlContent := template.HTML("")
	reactJSX := ""

	if len(values) == 2 {
		tmplName = values[0]
		component = values[1]
	}

	if strings.Contains(component, ".js") && len(t.reactFiles) > 0 {
		htmlContent, reactJSX, err = t.RenderReact(component, data)
		if err != nil {
			return err
		}
		name = tmplName
	}

	newData := extendPayload(data, tmplName, component, htmlContent, reactJSX)

	return t.templates.ExecuteTemplate(w, name, newData)
}

func (t *TemplateRenderer) RenderRSC(
	fragment string,
	data interface{},
) ([]byte, error) {
	reactRenderer, ok := t.reactCache[fragment]
	if !ok {
		ctx := v8go.NewContext()

		content, ok := t.reactFiles[fragment]
		if !ok {
			return nil, fmt.Errorf("react fragment not found: %s", fragment)
		}

		reactRenderer = &ReactRenderer{
			ctx:     ctx,
			content: content,
			name:    fragment,
		}
		t.reactCache[fragment] = reactRenderer
	}

	jsx, err := reactRenderer.RenderRSC(data)
	if err != nil {
		return nil, err
	}

	return []byte(jsx), nil
}

func (t *TemplateRenderer) RenderReact(
	fragment string,
	data interface{},
) (template.HTML, string, error) {
	reactRenderer, ok := t.reactCache[fragment]
	if !ok {
		ctx := v8go.NewContext()

		content, ok := t.reactFiles[fragment]
		if !ok {
			return "", "", fmt.Errorf("react fragment not found: %s", fragment)
		}

		reactRenderer = &ReactRenderer{
			ctx:     ctx,
			content: content,
			name:    fragment,
		}
		t.reactCache[fragment] = reactRenderer
	}

	return reactRenderer.Render(data)
}

func extendPayload(
	data interface{},
	name string,
	component string,
	htmlContent template.HTML,
	rscContent string,
) interface{} {
	templateID := strings.ReplaceAll(name, "/", "-")
	templateID = strings.ReplaceAll(templateID, ".html", "")
	serverUrl := env.GetServerURL()

	d, ok := data.(map[string]interface{})
	if ok {
		return map[string]interface{}{
			"Payload":          d,
			"Template":         name,
			"Component":        component,
			"TemplateID":       templateID,
			"ServerURL":        serverUrl,
			"InnerHtmlContent": htmlContent,
			"RSCContent":       rscContent,
		}
	}

	return &GeneralPayload{
		Payload:          data,
		Template:         name,
		TemplateID:       templateID,
		ServerURL:        serverUrl,
		Component:        component,
		InnerHtmlContent: htmlContent,
		RSCContent:       rscContent,
	}
}

func notNil(a interface{}) bool {
	return !reflect.ValueOf(a).IsNil()
}

func convertToJson(a interface{}) string {
	b, err := json.Marshal(a)
	if err != nil {
		return ""
	}

	return string(b)
}
