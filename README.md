# Code Formatting Standards

This repository contains a comprehensive set of code formatting standards and best practices for Next.js, TypeScript, Tailwind CSS, and modern React projects.

## Table of Contents

- [Setup](#setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Naming Conventions](#naming-conventions)
- [Component Structure](#component-structure)
- [TypeScript Standards](#typescript-standards)
- [Tailwind CSS Best Practices](#tailwind-css-best-practices)
- [Git Workflow](#git-workflow)
- [CI/CD Integration](#cicd-integration)

## Setup

1. Install dependencies:

```bash
npm install
```

2. The pre-commit hooks will be automatically set up after installation.

## Code Style Guidelines

### ESLint and Prettier

This project uses ESLint for code quality and Prettier for code formatting. The configuration is already set up in the following files:

- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier configuration

### VS Code Integration

We recommend using VS Code with the following extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense

The workspace settings in `.vscode/settings.json` are already configured to:

- Format on save
- Run ESLint fixes on save
- Use the correct tab size and line endings

## Naming Conventions

### Files and Directories

- **React Components**: Use PascalCase for component files and directories
  - Example: `Button.tsx`, `UserProfile.tsx`
- **Hooks**: Use camelCase with `use` prefix
  - Example: `useAuth.ts`, `useWindowSize.ts`
- **Utilities**: Use camelCase
  - Example: `formatDate.ts`, `stringUtils.ts`
- **Constants**: Use UPPER_SNAKE_CASE for constant files
  - Example: `API_ENDPOINTS.ts`
- **Types/Interfaces**: Use PascalCase with descriptive names
  - Example: `UserData.ts`, `ApiResponse.ts`

### Component Naming

- Use descriptive names that explain the component's purpose
- Prefix components with their domain if applicable
  - Example: `AuthButton.tsx`, `DashboardHeader.tsx`
- Suffix components with their variant if applicable
  - Example: `ButtonPrimary.tsx`, `ButtonSecondary.tsx`

### Function Naming

- **Component Functions**: Use PascalCase
  - Example: `export function UserProfile() { ... }`
- **Utility Functions**: Use camelCase with descriptive verbs
  - Example: `formatCurrency()`, `validateEmail()`
- **Event Handlers**: Use `handle` prefix with camelCase
  - Example: `handleSubmit()`, `handleInputChange()`

## Component Structure

### Folder Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Shared components
│   ├── ui/           # UI components (buttons, inputs, etc.)
│   ├── layout/       # Layout components
│   └── [domain]/     # Domain-specific components
├── hooks/            # Custom hooks
├── lib/              # Utility functions and libraries
├── types/            # TypeScript types and interfaces
└── styles/           # Global styles
```

### Component Organization

1. **Imports**: Organized in the following order:

   - React and Next.js imports
   - Third-party libraries
   - Internal absolute imports
   - Internal relative imports
   - Types and styles

2. **Component Definition**:

   - Props interface/type at the top
   - Component function
   - Helper functions inside the component if they're only used there

3. **Export**: Default export at the bottom

Example:

```tsx
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

import type { User } from '@/types';

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

export function UserCard({ user, onSelect }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(user);
    }
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-medium">{user.name}</h3>
      <p className="text-sm text-gray-500">{formatDate(user.joinedAt)}</p>
      {isExpanded && (
        <div className="mt-2">
          <p>{user.bio}</p>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
        <Button size="sm" onClick={handleSelect}>
          Select
        </Button>
      </div>
    </div>
  );
}
```

## TypeScript Standards

### Types vs Interfaces

- Use **interfaces** for defining object shapes that might be extended
- Use **types** for unions, intersections, or when you need to create complex types

### Type Organization

- Place shared types in the `src/types` directory
- Co-locate component-specific types with their components
- Export types from a barrel file (`index.ts`) for easier imports

### Type Naming

- Use PascalCase for type names
- Use descriptive suffixes like `Props`, `State`, `Context`, etc.
- Prefix event handler types with `on` (e.g., `onSubmit`)

### Best Practices

- Avoid using `any` type; use `unknown` instead when the type is truly unknown
- Use function type expressions for callback props:
  ```typescript
  type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
  ```
- Use generics for reusable components and utilities
- Use type inference where possible to reduce verbosity

## Tailwind CSS Best Practices

### Class Organization

- Use the official Prettier plugin for Tailwind CSS to automatically sort classes
- Group related classes together (layout, typography, colors, etc.)
- Extract common patterns to components or utility functions

### Component Patterns

1. **Composition over configuration**:

   - Create small, focused components
   - Combine them to build more complex UIs

2. **Use `clsx` or `cn` utility for conditional classes**:

   ```tsx
   import { cn } from '@/lib/utils';

   function Button({ className, variant = 'default', ...props }) {
     return (
       <button
         className={cn(
           'rounded-md px-4 py-2 font-medium',
           variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
           variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
           className
         )}
         {...props}
       />
     );
   }
   ```

3. **Extract common patterns to utility functions**:

   ```tsx
   // src/lib/utils.ts
   import { clsx, type ClassValue } from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

## Git Workflow

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `fix/*`: Bug fixes
- `release/*`: Release preparation

## CI/CD Integration

The project includes GitHub Actions workflows in `.github/workflows/ci.yml` that:

1. Run ESLint to check code quality
2. Run TypeScript type checking
3. Verify code formatting with Prettier

These checks run on pull requests to `main` and `develop` branches to ensure code quality and consistency.
