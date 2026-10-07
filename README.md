# Tax React Web

A React and TypeScript web application built with Vite.

## Requirements

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- Git, if you are cloning the repository

Check your installed versions:

```bash
node --version
npm --version
```

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd tax-react-web
npm install
```

## Run the development server

```bash
npm run dev
```

Open the URL shown in the terminal, usually `http://localhost:5173`.

## Available commands

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
npm run lint     # Check the code with ESLint
```

## Production build

```bash
npm run build
```

The generated files are placed in the `dist` folder.

## Project structure

```text
src/         Application source code
public/      Public static files
index.html   Main HTML entry point
package.json Project scripts and dependencies
```

## Troubleshooting

If dependencies are missing, run `npm install` again. If port 5173 is busy, Vite will display another available local URL.
