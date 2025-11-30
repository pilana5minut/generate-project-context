# Project Context Generation Utility

## Purpose

This utility is designed to automatically generate the `project_context.md` file, which contains complete information about the structure and contents of the project. The main purposes are:

1. **Creating a full project description**:
   The utility scans all files in the project and creates a file containing the full content of all files, which allows you to get a complete understanding of the project.

2. **Facilitating work with LLMs**:
   The `project_context.md` file can be used for uploading into language models (LLMs) for analysis, refactoring, or code generation based on an existing project.

3. **Documenting the project structure**:
   The utility generates a hierarchical representation of the project's file and directory structure, helping to better understand the project's architecture.

## Installation

Install the utility as a dev dependency into your project:

```bash
npm install --save-dev generate-project-context
```

## Usage

After installation, you can run the utility with the following command:

```bash
npx generate-context
```

The utility will perform the following actions:

1. Recursively scan all files from the current directory down to the deepest level
2. Exclude files listed in `.ignoreList` (located in the package directory)
3. Create a `project_context.md` file in the project root containing the complete contents of all project files

To update the project context, simply run the utility again — it will overwrite the `project_context.md` file with up-to-date information.

## File Filtering

The utility automatically excludes from analysis the files listed in the `.ignoreList`, which is located in the package directory (`node_modules`). The file is created during the first run of the utility. By default, the list includes:

- `project_context.md` — the file containing the full contents of all project files
- `package-lock.json` — the file with fixed dependency versions
- `node_modules` — the directory containing installed npm packages
- `.git` — Git repository files

To manage the list of ignored files, you can:

1. Run `npx generate-context ignore` to create or open the `.ignoreList` file
2. Or manually edit the `.ignoreList` file located in the package directory

You can use patterns in `.ignoreList` to specify files and directories that should be excluded from analysis.
