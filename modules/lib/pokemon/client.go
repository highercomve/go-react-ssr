package pokemon

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"reflect"
)

type PokemonApi struct {
	client *http.Client
}

const baseUrl = "https://pokeapi.co/api/v2"

var (
	pokemonsUrl = fmt.Sprintf("%s/pokemon", baseUrl)
)

func NewApi() *PokemonApi {
	api := new(PokemonApi)
	api.client = &http.Client{}

	return api
}

func (api *PokemonApi) GetAll(
	ctx context.Context,
	limit int,
	offset int,
) (*PokemonApiResponse, error) {
	uri, err := url.Parse(pokemonsUrl)
	if err != nil {
		return nil, err
	}

	query := uri.Query()
	query.Set("limit", fmt.Sprintf("%d", limit))
	query.Set("offset", fmt.Sprintf("%d", offset))
	uri.RawQuery = query.Encode()

	var result PokemonApiResponse
	err = api.do(ctx, http.MethodGet, uri.String(), nil, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (api *PokemonApi) GetByIDOrName(
	ctx context.Context,
	idOrName string,
) (*Pokemon, error) {
	uri, err := url.Parse(fmt.Sprintf("%s/%s", pokemonsUrl, idOrName))
	if err != nil {
		return nil, err
	}

	var result Pokemon
	err = api.do(ctx, http.MethodGet, uri.String(), nil, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (api *PokemonApi) do(ctx context.Context, method, url string, payload interface{}, result interface{}) error {
	if result == nil || (reflect.ValueOf(result).Kind() != reflect.Ptr) {
		return fmt.Errorf("result must be a non-nil pointer")
	}

	var reqBody *bytes.Buffer = nil
	var err error
	if payload != nil {
		body, err := json.Marshal(payload)
		if err != nil {
			return err
		}
		reqBody = bytes.NewBuffer(body)
	}

	var req *http.Request
	if method == http.MethodGet {
		req, err = http.NewRequestWithContext(ctx, method, url, nil)
	} else {
		req, err = http.NewRequestWithContext(ctx, method, url, reqBody)
	}
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := api.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return json.NewDecoder(resp.Body).Decode(result)
}
