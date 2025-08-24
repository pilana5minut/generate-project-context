# generate-context

A CLI tool to generate a `project_context.txt` file containing a directory tree and the contents of all non-ignored files in a project. Designed for frontend developers to document project structure and code for quick reference, code reviews, or sharing with AI tools/collaborators.

## Purpose

The `generate-context` package helps frontend developers (using JavaScript, TypeScript, React, etc.) create a single text file ( `project_context.txt` ) that includes:
* A timestamp of when the file was generated (in local timezone).
* A list of files that could not be read (if any).
* A `tree-cli`-style representation of the project directory structure.
* The contents of all files not excluded by `.ignoreList`.

This is useful for:
* Documenting project structure and code.
* Preparing context for AI-based code analysis.
* Sharing project snapshots with teammates.

## Installation

**Install as a development dependency:**

 `npm install --save-dev generate-project-context`

## Usage

**Run the tool in your project directory:**

 `npx generate-context`

* Scans the current directory.
* Applies .ignoreList filters and automatic ignore patterns.
* Creates project_context.txt in the project root (where package.json is, or current directory if not found).

**To edit the .ignoreList file:**

 `npx generate-context ignore`

* Opens .ignoreList in your default code editor (e.g., VS Code).
* If .ignoreList is missing, creates it with default content and opens it.

## Configuration

The tool uses a single configuration file, `.ignoreList` , located in `node_modules/generate-context/.ignoreList` . This file specifies additional files and directories to exclude from the output.

## Automatic Ignore Patterns

The following files and directories are automatically ignored and cannot be included:

* `node_modules/` (and all subdirectories)
* `.git/` (and all subdirectories)
* `.gitignore`
* `package-lock.json`
* `project_context.txt`

## `.ignoreList` Format

* Each line is a pattern to ignore.
* Use `#` for comments to disable rules.
* Supported patterns:
  + Directories: e.g.,  `dist/` (ignores the `dist` directory and its contents).
  + Files: e.g.,  `build.js` (ignores a specific file).
  + Extensions: e.g.,  `*.log` (ignores all files with `.log` extension).
  + Glob patterns: e.g.,  `**/test/**` (ignores all files in `test` directories at any depth).

#### Default `.ignoreList` :

```txt
# Automatically ignored files and directories:
# - node_modules (automatically ignored)
# - .git (automatically ignored)
# - .gitignore (automatically ignored)
# - package-lock.json (automatically ignored)
# - project_context.txt (automatically ignored)

# Add additional patterns to ignore here, if necessary
```

#### Example `.ignoreList` :

```txt
# Automatically ignored files and directories:
# - node_modules (automatically ignored)
# - .git (automatically ignored)
# - .gitignore (automatically ignored)
# - package-lock.json (automatically ignored)
# - project_context.txt (automatically ignored)

# Add additional patterns to ignore here, if necessary
dist/
*.log
build.js
**/test/**
# temp.js
```

### Using `.ignoreList`

1. Run `npx generate-context ignore` to open `.ignoreList`.
2. Add patterns for directories, files, or extensions to exclude.
3. Comment lines with `#` to disable specific rules.
4. Save the file. The next `npx generate-context` run will use the updated rules.

#### Notes:

* The .ignoreList file is created automatically when the package is installed.
* If .ignoreList is missing or inaccessible, both commands will fail with an error and prompt to run `npx generate-context ignore` to create it.
* Glob patterns follow the minimatch syntax (see [minimatch documentation](https://www.npmjs.com/package/minimatch)).

## Running from Subdirectories

The tool can be run from any subdirectory within the project:

* **From project root**: Shows complete project structure and all files.
* **From subdirectory**: Shows both complete project structure and subtree from current directory, but only processes files from the current directory and its subdirectories.

## Output Format

The `project_context.txt` file contains:

1. **Timestamp**: When the file was generated in local timezone (e.g., `Generated on: 24/08/2025, 19:44:57`).
2. **Errors** (if any): Files that could not be read, with error descriptions.
3. **Directory Tree**: A `tree-cli`-style representation of the project structure with IDE-like sorting (directories first, then files, both in alphabetical order).
4. **File Contents**: Contents of all non-ignored files, separated by headers.

### Tree Structure Sorting

The directory tree follows IDE-like sorting:
* **Directories first** (in alphabetical order)
* **Files second** (in alphabetical order)
* This rule applies recursively to all nested levels

### File Headers Format

Each file is preceded by a header with the following format:

```
// filename.js
//////////////////////////////

[file content]

```

### Binary File Handling

Binary files (images, executables, etc.) are detected automatically and show an informational message instead of content:

```
// image.png
//////////////////////////////

[Binary file content - not displayed]

```

#### Example `project_context.txt` (from project root):

```txt
Generated on: 24/08/2025, 19:44:57

Complete project structure:

my-project
├── src
│   ├── components
│   │   ├── Button.js
│   │   └── Header.js
│   ├── App.js
│   └── main.js
├── .ignoreList
├── LICENSE
├── package.json
└── README.md

// src\App.js
//////////////////////////////

import Button from './components/Button';
function App() {
  return <Button />;
}
export default App;

// src\main.js
//////////////////////////////

console.log('Hello, world!');

// package.json
//////////////////////////////

{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/main.js"
  }
}
```

#### Example `project_context.txt` (from subdirectory):

```txt
Generated on: 24/08/2025, 19:45:24

Complete project structure:

my-project
├── src
│   ├── components
│   │   ├── Button.js
│   │   └── Header.js
│   ├── App.js
│   └── main.js
├── .ignoreList
├── LICENSE
├── package.json
└── README.md

Subtree from current directory:

my-project/src
            ├── components
            │   ├── Button.js
            │   └── Header.js
            ├── App.js
            └── main.js

// App.js
//////////////////////////////

import Button from './components/Button';
function App() {
  return <Button />;
}
export default App;

// main.js
//////////////////////////////

console.log('Hello, world!');
```

## Error Handling

* If .ignoreList is missing, the tool prompts to run `npx generate-context ignore`.
* If a file cannot be read (e.g., binary or permission issues), it is skipped with a console warning.
* All errors are listed at the top of project_context.txt.
* Files are read and written in UTF-8 encoding.

## Requirements

* Node.js >= 16.0.0
