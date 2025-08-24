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
  // Получаем имя корневой директории
  const rootDirName = path.basename(rootDir)
  // Вычисляем относительный путь от корня проекта до стартовой директории
  const relativePath = path.relative(rootDir, startDir).replace(/\\/g, '/')

  // Формируем полный путь для отображения
  let fullPath = rootDirName
  if (relativePath && relativePath !== '.') {
    fullPath += '/' + relativePath
  }

  const treeWithRoot = fullPath + '\n' + tree
  // Преобразуем относительные пути в абсолютные
  const absoluteFiles = relativeFiles.map((relativePath) => path.join(rootDir, relativePath))
  await readFileContents(absoluteFiles, outputPath, treeWithRoot)
  console.log(`Project context written to ${outputPath}`)
}

module.exports = { generateContext }
