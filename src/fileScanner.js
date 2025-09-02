// src/fileScanner.js
const fs = require('fs/promises')
const path = require('path')
const { findProjectRoot } = require('./utils')
const { loadIgnorePatterns } = require('./filter')
const { generateTree } = require('./tree')
const { readFileContents } = require('./fileReader')

async function generateContext(startDir) {
  const rootDir = await findProjectRoot(startDir)
  const outputPath = path.join(rootDir, 'project_context.md') // Изменено с .txt на .md
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
    treeOutput = `## Complete project structure:\nBelow is a tree structure of the entire project as a whole.\n\`\`\`bash\n${fullTreeWithRoot}\n\`\`\`\n\n`
    filesToProcess = allFiles
  } else {
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
  await readFileContents(absoluteFiles, outputPath, treeOutput, filesToProcess.length)
  console.log(`Project context written to ${outputPath}`)
}

module.exports = { generateContext }
