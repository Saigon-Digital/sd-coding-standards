# Saigon Digital Coding Standards CLI

A command-line tool to quickly apply Saigon Digital's coding standards to any Next.js project.

## Features

- Applies standardized ESLint configuration
- Applies standardized Prettier configuration
- Applies standardized TypeScript configuration
- Sets up Git hooks for linting and type checking
- Installs required dependencies
- Works with any Next.js project, regardless of the template used (Prismic, Sanity, etc.)

## Installation

### Global Installation

```bash
npm install -g sd-coding-standards
```

### Using npx (without installation)

```bash
npx sd-coding-standards
```

## Usage

Navigate to your Next.js project directory and run:

```bash
sd-standards
```

Or specify a project path:

```bash
sd-standards --path /path/to/your/nextjs/project
```

### Options

- `-y, --yes`: Skip confirmation prompts
- `-p, --path <path>`: Path to Next.js project (defaults to current directory)
- `--skip-deps`: Skip installing dependencies
- `--skip-git-hooks`: Skip setting up git hooks
- `-V, --version`: Output the version number
- `-h, --help`: Display help for command

## What Gets Applied

1. **ESLint Configuration** (.eslintrc.js)
   - React best practices
   - TypeScript rules
   - Import ordering
   - Accessibility (jsx-a11y)
   - Tailwind CSS rules

2. **Prettier Configuration** (.prettierrc.js)
   - Consistent code formatting
   - Tailwind CSS class sorting

3. **TypeScript Configuration** (tsconfig.json)
   - Strict type checking
   - Next.js optimized settings

4. **Git Hooks**
   - Pre-commit: Lint and format staged files
   - Pre-push: Type checking

5. **Package.json Scripts**
   - `lint`: Run ESLint
   - `lint:fix`: Run ESLint with auto-fix
   - `format`: Run Prettier
   - `type-check`: Run TypeScript type checking

## Requirements

- Node.js 14 or higher
- A Next.js project

## License

MIT
