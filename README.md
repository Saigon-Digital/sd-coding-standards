# Saigon Digital Configuration Updater

A lightweight CLI tool to update essential configuration files in your project.

## Features

- Updates ESLint configuration (`.eslintrc.js`)
- Updates PostCSS configuration (`postcss.config.js`)
- Updates Tailwind CSS configuration (`tailwind.config.js`)

## Installation

### Global Installation

```bash
npm i -g https://github.com/Saigon-Digital/sd-coding-standards.git
```

### Using npx (without installation)

```bash
npx sd-coding-standards
```

## Usage

Navigate to your project directory and run:

```bash
sd-standards
```

Or specify a project path:

```bash
sd-standards --path /path/to/your/project
```

### Options

- `-y, --yes`: Skip confirmation prompts
- `-p, --path <path>`: Path to project (defaults to current directory)
- `-V, --version`: Output the version number
- `-h, --help`: Display help for command

## What Gets Updated

1. **ESLint Configuration** (`.eslintrc.js`)
   - React best practices
   - TypeScript rules
   - Import ordering
   - Accessibility (jsx-a11y)
   - Tailwind CSS rules

2. **PostCSS Configuration** (`postcss.config.js`)
   - Standard PostCSS setup

3. **Tailwind CSS Configuration** (`tailwind.config.js`)
   - Basic Tailwind CSS setup

## Requirements

- Node.js 14 or higher

## License

MIT
