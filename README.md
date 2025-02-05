# Go React SSR

## Overview

This project is a guide on how to render React components on the server-side using a Go backend. It demonstrates how to set up a basic Go server, integrate it with a React frontend, and perform server-side rendering (SSR) of React components. The project uses the Echo framework for the Go server, esbuild for bundling the JavaScript files, and v8go for running the JavaScript on the server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Key Components](#key-components)
- [Conclusion](#conclusion)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Go](https://golang.org/doc/install) (version 1.16 or higher)
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)

## Project Structure

The project is organized into the following directories and files:

```
go-react-ssr/
├── frontend
│   ├── app
│   │   ├── About.jsx
│   │   └── Home.jsx
│   ├── app.js
│   ├── components
│   │   ├── About.jsx
│   │   └── Home.jsx
│   ├── css
│   │   └── app.css
│   ├── img
│   └── server
│       ├── About.jsx
│       ├── Home.jsx
│       └── polyfill.js
├── go.mod
├── go.sum
├── main.go
├── modules
│   ├── app
│   │   └── app.go
│   ├── lib
│   │   └── env
│   │       └── env.go
│   └── server
│       ├── server.go
│       └── template.go
├── package.json
├── package-lock.json
├── README.md
└── templates
    ├── about.html
    ├── index.html
    └── layout
        ├── base.html
        ├── footer.html
        └── header.html
```

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/highercomve/go-react-ssr.git
   cd go-react-ssr
   ```

2. **Install Go dependencies:**

   ```sh
   go mod tidy
   ```

3. **Install Node.js dependencies:**

   ```sh
   npm install
   ```

## Running the Project

2. **Start the Go server:**

   ```sh
   go run main.go
   ```

3. **Open your browser and navigate to:**

   ```
   http://localhost:9090
   ```

## Key Components

### Frontend

- **React Components:**
  - `frontend/components/About.jsx`: Defines the `About` component.
  - `frontend/components/Home.jsx`: Defines the `Home` component.

- **Entry Points:**
  - `frontend/app/About.jsx`: Entry point for the `About` page.
  - `frontend/app/Home.jsx`: Entry point for the `Home` page.

- **CSS:**
  - `frontend/css/app.css`: Contains the global styles for the application.

### Backend

- **Go Server:**
  - `modules/app/app.go`: Defines the routes and handlers for the Go server.
  - `modules/server/server.go`: Configures and starts the Echo server.
  - `modules/server/template.go`: Handles the rendering of templates and React components using v8go to run the JavaScript.

- **Environment Configuration:**
  - `modules/lib/env/env.go`: Provides utility functions for environment variables.

### Build Tools

- **esbuild:**
  - The project uses esbuild to bundle the JavaScript files. esbuild is a fast JavaScript bundler and minifier that compiles the React components and other JavaScript code into a single bundle that can be served by the Go server. This ensures that the JavaScript code is optimized and ready for production use.

- **v8go:**
  - v8go is used to run the JavaScript on the server. It is a Go library that embeds the V8 JavaScript engine, allowing the Go server to execute JavaScript code. This is particularly useful for server-side rendering (SSR) of React components, as it enables the server to render the initial HTML content before sending it to the client, improving performance and SEO.

### Templates

- **HTML Templates:**
  - `templates/about.html`: Template for the About page.
  - `templates/index.html`: Template for the Home page.
  - `templates/layout/base.html`: Base layout template.
  - `templates/layout/footer.html`: Footer template.
  - `templates/layout/header.html`: Header template.

## Conclusion

This project serves as a comprehensive guide to setting up server-side rendering with React and a Go backend. By following the steps outlined in this guide, you can create a performant and SEO-friendly web application that leverages the power of both React and Go.

Feel free to explore the code, make modifications, and extend the functionality to suit your needs. If you have any questions or run into issues, please open an issue on the repository or reach out to the community for support.

Happy coding!
