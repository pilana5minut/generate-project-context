const fs = require('fs/promises')
const path = require('path')
const { findProjectRoot } = require('./utils')
const { loadIgnorePatterns } = require('./filter')
const { generateTree } = require('./tree')
const { readFileContents } = require('./fileReader')

async function generateContext(startDir) {
  const rootDir = await findProjectRoot(startDir)
  const outputPath = path.join(rootDir, 'project_context.txt')
  const ignorePatterns = await loadIgnorePatterns()

  console.log('Generating project context...')
  const { files, tree } = generateTree(startDir, '', [], ignorePatterns)
  await readFileContents(files, outputPath, tree)
  console.log(`Project context written to ${outputPath}`)
}

module.exports = { generateContext }
