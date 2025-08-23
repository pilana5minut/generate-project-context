# generate-context

A CLI tool to generate a `project_context.txt` file containing a directory tree and the contents of all non-ignored files in a project. Designed for frontend developers to document project structure and code for quick reference, code reviews, or sharing with AI tools/collaborators.

## Purpose
The `generate-context` package helps frontend developers (using JavaScript, TypeScript, React, etc.) create a single text file (`project_context.txt`) that includes:
- A timestamp of when the file was generated.
- A list of files that could not be read (if any).
- A `tree-cli`-style representation of the project directory structure.
- The contents of all files not excluded by `.ignoreList`.

This is useful for:
- Documenting project structure and code.
- Preparing context for AI-based code analysis.
- Sharing project snapshots with teammates.

## Installation
**Install as a development dependency:**

`npm install --save-dev generate-project-context`

## Usage
**Run the tool in your project directory:**

`npx generate-context`

- Scans the current directory.
- Applies .ignoreList filters.
- Creates project_context.txt in the project root (where package.json is, or current directory if not found).

**To edit the .ignoreList file:**

`npx generate-context ignore`

- Opens .ignoreList in your default code editor (e.g., VS Code).
- If .ignoreList is missing, creates it with default content (node_modules/) and opens it.

## Configuration

The tool uses a single configuration file, `.ignoreList`, located in `node_modules/generate-context/.ignoreList`. This file specifies files and directories to exclude from the output.

## `.ignoreList` Format

- Each line is a pattern to ignore.
- Use `#` for comments to disable rules.
- Supported patterns:
  - Directories: e.g., `dist/` (ignores the `dist` directory and its contents).
  - Files: e.g., `build.js` (ignores a specific file).
  - Extensions: e.g., `*.log` (ignores all files with `.log` extension).
  - Glob patterns: e.g., `**/test/**` (ignores all files in `test` directories at any depth).
- The `node_modules/` directory is always ignored and cannot be included.

#### Default `.ignoreList`:

```txt
node_modules/
```

#### Example `.ignoreList`:

```txt
node_modules/
dist/
*.log
build.js
**/test/**
# temp.js
```

### Using `.ignoreList`

1. Run `npx generate-context ignore to` open `.ignoreList`.
2. Add patterns for directories, files, or extensions to exclude.
3. Comment lines with `#` to disable specific rules.
4. Save the file. The next `npx generate-context` run will use the updated rules.

#### Notes:

- The .ignoreList file is created automatically when the package is installed.
- If .ignoreList is missing or inaccessible, both commands will fail with an error and prompt to run npx generate-context ignore to create it.
- Glob patterns follow the minimatch syntax (see [minimatch documentation](https://www.npmjs.com/package/minimatch)).

## Output Format

The `project_context.txt` file contains:

1. **Timestamp**: When the file was generated (e.g., `Generated on: 2025-08-23 20:57:00 CEST`).
2. **Errors** (if any): Files that could not be read, with error descriptions.
3. **Directory Tree**: A `tree-cli`-style representation of the project structure (excluding ignored files/directories).
4. **File Contents**: Contents of all non-ignored files, separated by headers.

#### Example `project_context.txt`:

```txt
Generated on: 2025-08-23 20:57:00 CEST

Files with errors:
- src/assets/image.png: Binary file
- src/locked.txt: Permission denied

my-project
│   .gitignore
│   package.json
│   src/main.js
│
└───src
    │   App.js
    │
    └───components
            Button.js

///////////////////////////////////////////////////////////////////////////////
// package.json

{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/main.js"
  }
}

///////////////////////////////////////////////////////////////////////////////
// src/main.js

console.log('Hello, world!');

///////////////////////////////////////////////////////////////////////////////
// src/App.js

import Button from './components/Button';
function App() {
  return <Button />;
}
export default App;

///////////////////////////////////////////////////////////////////////////////
// src/components/Button.js

export default function Button() {
  return <button>Click me</button>;
}
```

## Error Handling

- If .ignoreList is missing, the tool prompts to run npx generate-context ignore.
- If a file cannot be read (e.g., binary or permission issues), it is skipped with a console warning.
- All errors are listed at the top of project_context.txt.
- Files are read and written in UTF-8 encoding.

## Requirements

- Node.js >= 16.0.0
