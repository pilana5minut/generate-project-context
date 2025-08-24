const path = require('path')
const fs = require('fs')

function generateTree(rootDir, dir, prefix = '', files = [], ignorePatterns, treeLines = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const filtered = entries.filter((entry) => {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/')
    return require('./filter').isFileAllowed(relativePath, ignorePatterns)
  })

  filtered.forEach((entry, index) => {
    const isLast = index === filtered.length - 1
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
