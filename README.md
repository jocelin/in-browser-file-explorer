# Express React Starter

A modern starter configuration for full-stack TypeScript applications with Express and React, featuring hot reload for both frontend and backend.

## Features

- **Full-stack TypeScript** with Express backend and React frontend
- **Hot reload for both frontend and backend** with a single command
- **Modern tooling**: Vite for frontend, nodemon for backend
- **Zero-config development** - just run `yarn dev`
- **Production-ready** build system
- **Code quality**: ESLint and Prettier for consistent code formatting and linting

## Project Structure

```
├── src/
│   ├── frontend/          # React frontend code
│   │   ├── App.tsx       # Main React component
│   │   ├── main.ts       # Frontend entry point
│   │   └── index.html    # Legacy HTML template (deprecated)
│   └── backend/          # Express backend code
│       ├── main.ts       # Modern backend server
│       └── main.legacy.ts # Legacy backend server (deprecated)
├── index.html            # Frontend HTML template
├── vite.config.ts        # Vite configuration
├── nodemon.json          # Nodemon configuration
├── build.js              # Custom build script
├── webpack.config.js     # Legacy Webpack config (deprecated)
└── tsconfig.legacy.json  # Legacy TypeScript config (deprecated)
```

## Dependencies

- Install `node`
  - Use NVM (https://github.com/nvm-sh/nvm): `nvm install lts/dubnium && nvm use lts/dubnium`
  - Alternatively you can download and install it manually: https://nodejs.org/en/download/
- Install `yarn ^1.10.1`
  - Use brew (https://brew.sh/): `brew install yarn`
  - Alternatively you can download and install it manually: https://classic.yarnpkg.com/en/docs/install

## Development

- Download and install VSCode: https://code.visualstudio.com/
- Read the setup guide https://code.visualstudio.com/docs/setup/setup-overview
  - Launching VSCode from the command line: Open the Command Palette (F1) and type `shell command` to find the `Shell Command: Install 'code' command in PATH command`
    - After doing this you can start VSCode on a repo with `code .`
- Install TSLint extension in VSCode https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin
- In order to run the debugger for backend/tests put a breakpoint in VSCode and run this command in VSCode (`CMD + SHIFT + P`): `Debug: attach node to process`. You can also enable `Debug: Toggle Auto Attach` to start the debugger every time a node process is started from VSCode terminal.
- To open a terminal in VSCode: ``CTRL + ` ``

## Usage

### Development (Recommended)

- Install dependencies: `yarn install`
- **Start development with hot reload for both frontend and backend**: `yarn dev`
  - Frontend: http://localhost:3000 (Vite dev server with hot reload)
  - Backend: http://localhost:8080 (Express server with nodemon auto-restart)
  - Both servers run concurrently with a single command
  - **Note**: In development, frontend and backend run on separate ports for hot reload

### Production Build

- Build application (both frontend and backend): `yarn build`
- Run production server (serves both frontend and backend on port 8080): `yarn start`

### Additional Commands

- Build frontend only: `yarn build:frontend`
- Run tests: `yarn test`
- Check linting: `yarn lint`
- Fix linting issues: `yarn lint:fix`
- Format code with Prettier: `yarn prettier`
- Check Prettier formatting: `yarn prettier:check`
- Preview production build: `yarn preview`
- Clean build artifacts: `yarn clean`

### Legacy Webpack Commands (Deprecated)

⚠️ **These commands are deprecated and will be removed in a future version. Use the modern commands above instead.**

- `yarn legacy:build` - Legacy Webpack build (use `yarn build` instead)
- `yarn legacy:build-watch` - Legacy Webpack watch (use `yarn dev` instead)
- `yarn legacy:build-hot-reload` - Legacy Webpack dev server (use `yarn dev` instead)
- `yarn legacy:start` - Legacy Webpack start (use `yarn start` instead)
- `yarn legacy:test` - Legacy Webpack test (use `yarn test` instead)

## Useful links

- Typescript guide: https://basarat.gitbook.io/typescript/
- VSCode custom settings: https://github.com/gianluca-venturini/env_confs/tree/master/vs_codet
