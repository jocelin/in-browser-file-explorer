# In-Browser File Explorer

A fully functional, frontend-only file explorer built with React and TypeScript. This application provides a virtualized tree view with drag and drop functionality that can efficiently handle large file systems with thousands of files, featuring modern UI design and comprehensive testing.

## 🚀 Live Demo

**Try the application online:** [View Demo on GitHub Pages](https://jocelin.github.io/in-browser-file-explorer/)

> **📖 For detailed application features and usage instructions, see [FILE_EXPLORER_README](./docs/FILE_EXPLORER_README.md)**

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd in-browser-file-explorer
yarn install

# Start development server
yarn dev
```

Open http://localhost:3000 in your browser.

## Prerequisites

- **Node.js** >= 10.18.0
- **Yarn** >= 1.10.1

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

### GitHub Pages Deployment

The application is automatically deployed to GitHub Pages and available at:
**https://jocelin.github.io/in-browser-file-explorer/**

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

## Project Structure

```
├── src/
│   ├── frontend/         # React frontend code
│   │   ├── components/   # Reusable UI components
│   │   │   ├── __tests__/ # Component test files
│   │   │   ├── buttons.css # Button styles
│   │   │   └── *.tsx     # React components
│   │   ├── containers/   # Main application containers
│   │   │   ├── __tests__/ # Container test files
│   │   │   └── *.tsx     # Container components
│   │   ├── contexts/     # React context providers
│   │   │   ├── __tests__/ # Context test files
│   │   │   └── *.tsx     # Context providers
│   │   ├── hooks/        # Custom React hooks
│   │   │   ├── __tests__/ # Hook test files
│   │   │   └── *.ts      # Custom hooks
│   │   ├── types/        # TypeScript type definitions
│   │   │   └── *.ts      # Type definitions
│   │   ├── App.tsx       # Main application component
│   │   ├── App.spec.tsx  # App component tests
│   │   ├── main.tsx      # Application entry point
│   │   └── index.css     # Tailwind CSS styles
│   ├── backend/          # Express backend code
│   │   ├── __tests__/    # Backend test files
│   │   └── main.ts       # Backend entry point
│   └── test/             # Jest test setup and utilities
├── docs/                 # Project documentation
├── dist/                 # Build output directory
│   ├── backend/          # Compiled backend code
│   ├── frontend/         # Compiled frontend code
│   └── www/              # Production web assets
├── coverage/             # Test coverage reports
├── index.html            # Frontend HTML template
├── vite.config.ts        # Vite configuration
├── jest.config.js        # Jest configuration
├── nodemon.json          # Nodemon configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.build.json   # Build-specific TypeScript config
└── eslint.config.mjs     # ESLint configuration
```

## Technology Stack

### Frontend

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Drag and drop functionality

### Backend

- **Express** - Web framework for serving static files
- **TypeScript** - Type safety
- **Nodemon** - Development server

### Testing

- **Jest** - Test framework
- **React Testing Library** - React component testing
- **ts-jest** - TypeScript support for Jest
- **@testing-library/jest-dom** - Custom Jest matchers

### Development Tools

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands
- **tsx** - TypeScript execution for development

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
