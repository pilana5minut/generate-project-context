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

  // Генерируем полное дерево проекта
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

  // Проверяем, запущен ли скрипт из корня проекта
  const isFromRoot = path.resolve(startDir) === path.resolve(rootDir)

  let treeOutput = ''
  let filesToProcess = []

  if (isFromRoot) {
    // Если запуск из корня проекта - показываем только полное дерево и все файлы
    treeOutput = `Complete project structure:\n\n${fullTreeWithRoot}\n\n\n\n\n\n\n\n\n\n`
    filesToProcess = allFiles
  } else {
    // Если запуск из вложенной директории - показываем полное дерево и поддерево, но только файлы из поддерева
    const { files: subFiles, tree: subTree } = generateTree(
      rootDir,
      startDir,
      '',
      [],
      ignorePatterns,
      []
    )

    // Вычисляем относительный путь от корня проекта до стартовой директории
    const relativePath = path.relative(rootDir, startDir).replace(/\\/g, '/')

    // Формируем полный путь для отображения поддерева
    let fullPath = rootDirName
    if (relativePath && relativePath !== '.') {
      fullPath += '/' + relativePath
    }

    // Вычисляем длину пути до родительской директории
    const parentPathLength = fullPath.length - path.basename(startDir).length
    // Создаем отступ для выравнивания
    const indent = ' '.repeat(parentPathLength)

    // Добавляем отступ к каждой строке поддерева
    const indentedSubTree = subTree
      .split('\n')
      .map((line) => indent + line)
      .join('\n')
    const subTreeWithRoot = fullPath + '\n' + indentedSubTree

    treeOutput = `Complete project structure:\n\n${fullTreeWithRoot}\n\n\n\n\n\n\n\n\n\nSubtree from current directory:\n\n${subTreeWithRoot}\n\n\n\n\n\n\n\n\n\n`

    // Используем только файлы из поддерева
    filesToProcess = subFiles
  }

  // Преобразуем относительные пути в абсолютные
  const absoluteFiles = filesToProcess.map((relativePath) => path.join(rootDir, relativePath))
  await readFileContents(absoluteFiles, outputPath, treeOutput)
  console.log(`Project context written to ${outputPath}`)
}

module.exports = { generateContext }
