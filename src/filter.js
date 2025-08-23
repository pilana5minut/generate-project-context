const fs = require('fs/promises')
const path = require('path') // Добавлен импорт path
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
    return ['node_modules/**', '**/node_modules/**'].concat(patterns)
  } catch (err) {
    console.error('Failed to read .ignoreList:', err.message)
    return ['node_modules/**', '**/node_modules/**']
  }
}

function isFileAllowed(filePath, ignorePatterns) {
  const normalizedPath = path.normalize(filePath).replace(/\\/g, '/')
  const isIgnored = ignorePatterns.some((pattern) => {
    const match = minimatch(normalizedPath, pattern, { matchBase: true })
    if (match) {
      console.log(`Ignoring ${normalizedPath} due to pattern: ${pattern}`)
    }
    return match
  })
  return !isIgnored
}

module.exports = { loadIgnorePatterns, isFileAllowed }
