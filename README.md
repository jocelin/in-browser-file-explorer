# In-Browser File Explorer

A modern full-stack TypeScript application with Express backend and React frontend, featuring hot reload and comprehensive testing.

## Features

- **Full-stack TypeScript** with Express backend and React frontend
- **Hot reload for both frontend and backend** with a single command
- **Modern tooling**: Vite for frontend, nodemon for backend
- **Comprehensive testing** with Jest
- **Zero-config development** - just run `yarn dev`
- **Production-ready** build system
- **Code quality**: ESLint and Prettier for consistent code formatting and linting

## Project Structure

```
├── src/
│   ├── frontend/          # React frontend code
│   │   ├── App.tsx       # Main React component
│   │   ├── main.ts       # Frontend entry point
│   │   └── index.html    # HTML template
│   ├── backend/          # Express backend code
│   │   ├── main.ts       # Backend server
│   │   └── example.spec.ts # Example test file
│   └── test-setup.ts     # Jest test setup
├── index.html            # Frontend HTML template
├── vite.config.ts        # Vite configuration
├── jest.config.js        # Jest configuration
├── nodemon.json          # Nodemon configuration
└── tsconfig.json         # TypeScript configuration
```

## Prerequisites

- **Node.js** >= 18.0.0
- **Yarn** >= 1.22.0

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd in-browser-file-explorer

# Install dependencies
yarn install
```

## Development

### Start Development Server

```bash
# Start both frontend and backend with hot reload
yarn dev
```

This will start:

- **Frontend**: http://localhost:3000 (Vite dev server with hot reload)
- **Backend**: http://localhost:8080 (Express server with nodemon auto-restart)

### Individual Services

```bash
# Frontend only
yarn dev:frontend

# Backend only
yarn dev:backend
```

## Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

## Production

### Build

```bash
# Build both frontend and backend
yarn build
```

### Start Production Server

```bash
# Start production server
yarn start
```

## Code Quality

```bash
# Check linting
yarn lint

# Fix linting issues
yarn lint:fix

# Format code with Prettier
yarn prettier

# Check Prettier formatting
yarn prettier:check
```

## Utilities

```bash
# Preview production build
yarn preview

# Clean build artifacts
yarn clean

# Clean everything (including node_modules)
yarn clean:all
```

## Technology Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Backend

- **Express** - Web framework
- **TypeScript** - Type safety
- **Nodemon** - Development server

### Testing

- **Jest** - Test framework
- **ts-jest** - TypeScript support for Jest

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands

## API Endpoints

- `GET /api/time` - Returns current server time

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `yarn test`
5. Check code quality: `yarn lint && yarn prettier:check`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## License

MIT
