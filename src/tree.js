const path = require('path')
const fs = require('fs')

function generateTree(dir, prefix = '', files = [], ignorePatterns) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const filtered = entries.filter((entry) => {
    const fullPath = path.join(dir, entry.name)
    return require('./filter').isFileAllowed(fullPath, ignorePatterns)
  })

  filtered.forEach((entry, index) => {
    const isLast = index === filtered.length - 1
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(process.cwd(), fullPath)
    files.push(relativePath)

    console.log(`${prefix}${isLast ? '└──' : '├──'} ${entry.name}`)
    if (entry.isDirectory()) {
      generateTree(fullPath, `${prefix}${isLast ? '    ' : '│   '}`, files, ignorePatterns)
    }
  })

  return files
}

module.exports = { generateTree }
