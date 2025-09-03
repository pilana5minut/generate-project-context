# Generated on: 03/09/2025, 16:45:46

## Complete project structure:
Below is a tree structure of the entire project as a whole.
```bash
generate-project-context
├── src
│   ├── fileReader.js
│   ├── fileScanner.js
│   ├── filter.js
│   ├── index.js
│   ├── tree.js
│   └── utils.js
├── .ignoreList
├── LICENSE
└── package.json
```

## Files with the code for the entire project
Below is the code for all project files.
Total number of files presented here: **9**

### src\fileReader.js
```js
// src/fileReader.js
const fs = require('fs/promises')
const path = require('path')

async function isTextFile(filePath) {
  try {
    const buffer = await fs.readFile(filePath)
    const sample = buffer.slice(0, 1024)
    if (sample.includes(0)) {
      return false
    }
    try {
      sample.toString('utf-8')
      return true
    } catch {
      return false
    }
  } catch (err) {
    return false
  }
}

function getCodeBlockLanguage(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  return extension ? extension.slice(1) : ''
}

async function readFileContents(files, outputPath, treeOutput, fileCount, isFromRoot) {
  const errors = []
  const contents = []
  const timestamp = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  for (const file of files) {
    try {
      const stats = await fs.stat(file)
      if (stats.isDirectory()) {
        continue
      }

      if (file.includes('node_modules')) {
        console.log(`Skipping ${file} because it is in node_modules`)
        continue
      }

      const relativePath = path.relative(process.cwd(), file)
      const isText = await isTextFile(file)

      if (isText) {
        const content = await fs.readFile(file, 'utf-8')
        const language = getCodeBlockLanguage(file)
        contents.push(`### ${relativePath}\n\`\`\`${language}\n${content}\n\`\`\`\n`)
      } else {
        contents.push(
          `### ${relativePath}\n\`\`\`\n[Binary file content - not displayed]\n\`\`\`\n`
        )
      }
    } catch (err) {
      console.warn(`Failed to read ${file}: ${err.message}`)
      errors.push(`${file}: ${err.message}`)
    }
  }

  let output = `# Generated on: ${timestamp}\n\n`
  if (errors.length > 0) {
    output += `## Errors:\nBelow is a list of files that could not be read:\n${errors
      .map((err) => `- ${err}`)
      .join('\n')}\n\n`
  }
  output += treeOutput
  if (contents.length > 0) {
    if (isFromRoot) {
      output += `## Files with the code for the entire project\nBelow is the code for all project files.\nTotal number of files presented here: **${fileCount}**\n\n`
    } else {
      output += `## Code files included in the above subtree\nBelow is the code for all files included in the above subtree.\nTotal number of files presented here: **${fileCount}**\n\n`
    }
  }
  output += contents.join('\n')

  await fs.writeFile(outputPath, output, 'utf-8')
}

module.exports = { readFileContents }

```

### src\fileScanner.js
```js
// src/fileScanner.js
const fs = require('fs/promises')
const path = require('path')
const { findProjectRoot } = require('./utils')
const { loadIgnorePatterns } = require('./filter')
const { generateTree } = require('./tree')
const { readFileContents } = require('./fileReader')

async function generateContext(startDir) {
  const rootDir = await findProjectRoot(startDir)
  const outputPath = path.join(rootDir, 'project_context.md')
  const ignorePatterns = await loadIgnorePatterns()

  console.log('Generating project context...')

  const { files: allFiles, tree: fullTree } = generateTree(
    rootDir,
    rootDir,
    '',
    [],
    ignorePatterns,
    []
  )
  const rootDirName = path.basename(rootDir)
  const fullTreeWithRoot = rootDirName + '\n' + fullTree

  const isFromRoot = path.resolve(startDir) === path.resolve(rootDir)

  let treeOutput = ''
  let filesToProcess = []

  if (isFromRoot) {
    // Только полное дерево, если запуск из корня
    treeOutput = `## Complete project structure:\nBelow is a tree structure of the entire project as a whole.\n\`\`\`bash\n${fullTreeWithRoot}\n\`\`\`\n\n`
    filesToProcess = allFiles
  } else {
    // Полное дерево и поддерево, если запуск из вложенной директории
    const { files: subFiles, tree: subTree } = generateTree(
      rootDir,
      startDir,
      '',
      [],
      ignorePatterns,
      []
    )

    const relativePath = path.relative(rootDir, startDir).replace(/\\/g, '/')
    let fullPath = rootDirName
    if (relativePath && relativePath !== '.') {
      fullPath += '/' + relativePath
    }

    const parentPathLength = fullPath.length - path.basename(startDir).length
    const indent = ' '.repeat(parentPathLength)
    const indentedSubTree = subTree
      .split('\n')
      .map((line) => indent + line)
      .join('\n')
    const subTreeWithRoot = fullPath + '\n' + indentedSubTree

    treeOutput = `## Complete project structure:\nBelow is a tree structure of the entire project as a whole.\n\`\`\`bash\n${fullTreeWithRoot}\n\`\`\`\n\n## Subtree from current directory:\nBelow is a tree structure of only part of the project.\n\`\`\`bash\n${subTreeWithRoot}\n\`\`\`\n\n`
    filesToProcess = subFiles
  }

  const absoluteFiles = filesToProcess.map((relativePath) => path.join(rootDir, relativePath))
  await readFileContents(absoluteFiles, outputPath, treeOutput, filesToProcess.length, isFromRoot)
  console.log(`Project context written to ${outputPath}`)
}

module.exports = { generateContext }

```

### src\filter.js
```js
// src/filter.js
const fs = require('fs/promises')
const path = require('path')
const { minimatch } = require('minimatch')
const { getIgnoreListPath } = require('./utils')

async function loadIgnorePatterns() {
  const ignoreListPath = getIgnoreListPath()
  try {
    const content = await fs.readFile(ignoreListPath, 'utf-8')
    const patterns = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
    return [
      'node_modules',
      'node_modules/**',
      '**/node_modules/**',
      'node_modules/*',
      '**/node_modules/*',
      '.git/**',
      '**/.git/**',
      '.git',
      '.gitignore',
      'package-lock.json',
      'project_context.md', // Изменено с project_context.txt на project_context.md
    ].concat(patterns)
  } catch (err) {
    console.error('Failed to read .ignoreList:', err.message)
    return [
      'node_modules',
      'node_modules/**',
      '**/node_modules/**',
      'node_modules/*',
      '**/node_modules/*',
      '.git/**',
      '**/.git/**',
      '.git',
      '.gitignore',
      'package-lock.json',
      'project_context.md', // Изменено с project_context.txt на project_context.md
    ]
  }
}

function isFileAllowed(relativePath, ignorePatterns) {
  return !ignorePatterns.some((pattern) => {
    const match = minimatch(relativePath, pattern, { matchBase: true })
    if (match) {
      console.log(`Ignoring ${relativePath} due to pattern: ${pattern}`)
    }
    return match
  })
}

module.exports = { loadIgnorePatterns, isFileAllowed }

```

### src\index.js
```js
#!/usr/bin/env node

const { program } = require('commander')
const { generateContext } = require('./fileScanner')
const { checkIgnoreList, openIgnoreList } = require('./utils')

program
  .version('1.0.0')
  .description('Generate a project context file with directory tree and file contents')

program
  .command('ignore')
  .description('Open or create .ignoreList in the default editor')
  .action(async () => {
    await checkIgnoreList(true)
    await openIgnoreList()
  })

program.action(async () => {
  await checkIgnoreList()
  await generateContext(process.cwd())
})

program.parse(process.argv)

```

### src\tree.js
```js
const path = require('path')
const fs = require('fs')

function generateTree(rootDir, dir, prefix = '', files = [], ignorePatterns, treeLines = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const filtered = entries.filter((entry) => {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/')
    return require('./filter').isFileAllowed(relativePath, ignorePatterns)
  })

  // Разделяем на директории и файлы
  const directories = filtered
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
  const fileEntries = filtered
    .filter((entry) => entry.isFile())
    .sort((a, b) => a.name.localeCompare(b.name))

  // Объединяем: сначала директории, затем файлы
  const sortedEntries = [...directories, ...fileEntries]

  sortedEntries.forEach((entry, index) => {
    const isLast = index === sortedEntries.length - 1
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/')
    treeLines.push(`${prefix}${isLast ? '└──' : '├──'} ${entry.name}`)

    if (entry.isFile()) {
      files.push(relativePath)
    }

    if (entry.isDirectory()) {
      generateTree(
        rootDir,
        fullPath,
        `${prefix}${isLast ? '    ' : '│   '}`,
        files,
        ignorePatterns,
        treeLines
      )
    }
  })

  return { files, tree: treeLines.join('\n') }
}

module.exports = { generateTree }

```

### src\utils.js
```js
// src/utils.js
const fs = require('fs/promises')
const path = require('path')
const open = require('open')

async function findProjectRoot(startDir) {
  let currentDir = startDir
  while (currentDir !== path.parse(currentDir).root) {
    try {
      await fs.access(path.join(currentDir, 'package.json'))
      return currentDir
    } catch {
      currentDir = path.dirname(currentDir)
    }
  }
  console.warn('package.json not found. Using current directory:', startDir)
  return startDir
}

function getIgnoreListPath() {
  return path.join(__dirname, '..', '.ignoreList')
}

async function createIgnoreList() {
  const ignoreListPath = getIgnoreListPath()
  const defaultContent = `# Automatically ignored files and directories:
# - node_modules (automatically ignored)
# - .git (automatically ignored)
# - .gitignore (automatically ignored)
# - package-lock.json (automatically ignored)
# - project_context.md (automatically ignored)
# Add additional patterns to ignore here, if necessary
node_modules/
`
  await fs.writeFile(ignoreListPath, defaultContent, 'utf-8')
  console.log('Created .ignoreList at:', ignoreListPath)
}

async function checkIgnoreList(openAfterCreate = false) {
  const ignoreListPath = getIgnoreListPath()
  try {
    await fs.access(ignoreListPath)
  } catch {
    console.error('.ignoreList not found at:', ignoreListPath)
    if (openAfterCreate) {
      console.log('Creating default .ignoreList...')
      await createIgnoreList()
    } else {
      console.error('Please run "npx generate-context ignore" to create .ignoreList.')
      process.exit(1)
    }
  }
}

async function openIgnoreList() {
  const ignoreListPath = getIgnoreListPath()
  try {
    await open(ignoreListPath)
    console.log('Opened .ignoreList in default editor')
  } catch (err) {
    console.error('Failed to open .ignoreList:', err.message)
    process.exit(1)
  }
}

module.exports = {
  findProjectRoot,
  getIgnoreListPath,
  checkIgnoreList,
  createIgnoreList,
  openIgnoreList,
}

```

### .ignoreList
```
# Automatically ignored files and directories:
# - node_modules (automatically ignored)
# - .git (automatically ignored)
# - .gitignore (automatically ignored)
# - package-lock.json (automatically ignored)
# - project_context.md (automatically ignored)

# Add additional patterns to ignore here, if necessary

```

### LICENSE
```
Copyright (c) 2025 Maxim Mogilevskiy <mogilevskiymv@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

### package.json
```json
{
  "name": "generate-project-context",
  "version": "1.0.17",
  "description": "CLI tool to generate a project context file with directory tree and file contents",
  "main": "src/index.js",
  "bin": {
    "generate-context": "src/index.js"
  },
  "scripts": {
    "context": "node src/index.js"
  },
  "keywords": [
    "cli",
    "file-structure",
    "project-context",
    "documentation"
  ],
  "author": "Maxim Mogilevskiy <mogilevskiymv@gmail.com>",
  "license": "MIT",
  "files": [
    "src",
    ".ignoreList",
    "LICENSE"
  ],
  "dependencies": {
    "commander": "^12.1.0",
    "minimatch": "^10.0.1",
    "open": "^8.4.2"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}

```
