# Generate Project Context

A CLI tool for automatically generating project context files with a tree structure of directories and the contents of all files in a convenient markdown format.

## What is it?

`generate-project-context` is a command-line utility that scans your project structure and creates a single markdown file (`project_context.md`) containing:

- Complete tree structure of the project
- Contents of all text files with syntax highlighting
- Automatic ignoring of unnecessary files and directories
- Support for working from both project root and subdirectories

## Purpose

The utility is especially useful for:

- **Working with AI assistants** — providing complete project context for code analysis
- **Project documentation** — quickly creating a snapshot of structure and content
- **Code Review** — reviewing the entire codebase in a single file
- **Onboarding new developers** — familiarizing with project architecture
- **Archiving** — preserving project state at a specific point in time

## Installation and Usage

### Usage without installation (recommended)

The simplest way is to use `npx` without installing the package:

```bash
# Generate context for current project
npx generate-project-context

# Create/edit ignore file
npx generate-project-context ignore
```

### Local installation

```bash
# Install in project
npm install --save-dev generate-project-context

# Use via npm scripts
npm run context
```

### Global installation

```bash
# Global installation
npm install -g generate-project-context

# Use from any directory
generate-context
```

## Main commands

### Context generation

```bash
# From project root (creates complete structure)
npx generate-project-context

# From any subdirectory (creates structure + focus on current directory)
cd src/components
npx generate-project-context
```

### Managing ignore files

```bash
# Create or open .ignoreList for editing
npx generate-project-context ignore
```

## File ignoring system

The utility automatically ignores standard files and directories:
- `node_modules/`
- `.git/`
- `.gitignore`
- `package-lock.json`
- `project_context.md` (avoiding recursion)

### Configuring additional ignore patterns

To ignore additional files and directories, create a `.ignoreList` file in the project root. The file uses glob patterns (similar to `.gitignore`).

#### Basic pattern writing rules:

**Comments**
```
# This is a comment - lines starting with # are ignored
```

**Ignoring specific files**
```
config.local.js          # Ignore config.local.js file
.env                     # Ignore .env file
secret.key              # Ignore secret.key file
```

**Ignoring by extension**
```
*.log                   # All files with .log extension
*.tmp                   # All temporary files
*.cache                 # All cache files
```

**Ignoring directories**
```
dist/                   # dist directory and all its contents
build/                  # build directory and all its contents
temp/                   # temp directory and all its contents
```

**Recursive ignoring (anywhere in project)**
```
**/logs/**              # All logs directories anywhere in project
**/node_modules/**      # All node_modules (at any level)
**/*.test.js            # All test files anywhere
```

**Ignoring at specific level**
```
src/temp/               # Only temp directory inside src
docs/*.draft.md         # Only draft files in docs directory
```

#### Complete example of `.ignoreList` file:

```
# Automatically generated files
dist/**
build/**
out/**

# Logs and temporary files
*.log
*.tmp
*.cache
temp/

# Sensitive data
.env
.env.local
.env.production
config/secrets.json

# IDEs and editors
.vscode/
.idea/
*.swp
*.swo

# Testing and code coverage
coverage/**
**/.nyc_output/**
**/*.test.js.snap

# Framework-specific directories
.next/**              # Next.js
.nuxt/**              # Nuxt.js
.svelte-kit/**        # SvelteKit
dist-electron/**      # Electron

# Documentation (if not needed in context)
docs/api/**
**/*.draft.md

# Large data files
**/*.sql
**/*.dump
data/large-dataset.json
```

#### Usage tips:

1. **Start simple** — add patterns as needed
2. **Use comments** — group patterns by categories for convenience
3. **Test patterns** — run the utility and see what gets ignored in the output
4. **Be careful with `**`** — such patterns may exclude more files than expected

The utility will output information about which files are being ignored to the console, helping debug patterns.

## Examples of resulting file

### Project structure example

```markdown
# Generated on: 03/09/2025, 14:02:24

## Complete project structure:
Below is a tree structure of the entire project as a whole.
```bash
my-awesome-project
├── src
│   ├── components
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── utils
│   │   └── helpers.js
│   └── index.js
├── tests
│   └── app.test.js
├── package.json
└── README.md
```

## Files with the code for the entire project
Below is the code for all project files.
Total number of files presented here: **6**

### src/components/Header.js
```js
import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
```

### src/utils/helpers.js
```js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(new Date(date));
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
```

### package.json
```json
{
  "name": "my-awesome-project",
  "version": "1.0.0",
  "description": "Awesome project description",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.0.0"
  }
}
```
```

### Example of working from subdirectory

When run from a subdirectory, two structures are generated:
1. Complete project structure
2. Focused structure of current subdirectory

```markdown
## Complete project structure:
Below is a tree structure of the entire project as a whole.
```bash
my-project
├── src
│   ├── components
│   └── utils
└── package.json
```

## Subtree from current directory:
Below is a tree structure of only part of the project.
```bash
my-project/src/components
├── Header.js
├── Footer.js
└── Button.js
```
```

## Technical features

- **Auto-detection of project root** by presence of `package.json`
- **Smart file type detection** — distinguishing text and binary files
- **Syntax highlighting** — automatic language detection by file extension
- **Cross-platform** — correct operation on Windows, macOS, Linux
- **Asynchronous processing** — efficient work with large projects

## Requirements

- Node.js >= 16.0.0
- npm or yarn

## License

MIT License. Details in [LICENSE](LICENSE) file.

## Author

Maxim Mogilevskiy <mogilevskiymv@gmail.com>

## Support

If you have questions or suggestions for improvement, please create issues in the project repository.

---

**Tip**: Add `project_context.md` to `.gitignore` if you don't want to commit generated files to the repository.
