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
  const { files: relativeFiles, tree } = generateTree(rootDir, startDir, '', [], ignorePatterns, [])
  // Добавляем имя стартовой директории в начало дерева
  const treeWithRoot = path.basename(startDir) + '\n' + tree
  // Преобразуем относительные пути в абсолютные
  const absoluteFiles = relativeFiles.map((relativePath) => path.join(rootDir, relativePath))
  await readFileContents(absoluteFiles, outputPath, treeWithRoot)
  console.log(`Project context written to ${outputPath}`)
}

module.exports = { generateContext }
