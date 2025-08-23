const fs = require('fs/promises')
const { minimatch } = require('minimatch') // Изменено с require('minimatch')
const { getIgnoreListPath } = require('./utils')

async function loadIgnorePatterns() {
  const ignoreListPath = getIgnoreListPath()
  try {
    const content = await fs.readFile(ignoreListPath, 'utf-8')
    const patterns = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
    return ['node_modules/**'].concat(patterns)
  } catch (err) {
    console.error('Failed to read .ignoreList:', err.message)
    return ['node_modules/**']
  }
}

function isFileAllowed(filePath, ignorePatterns) {
  const relativePath = filePath.replace(/\\/g, '/')
  return !ignorePatterns.some((pattern) => minimatch(relativePath, pattern, { matchBase: true }))
}

module.exports = { loadIgnorePatterns, isFileAllowed }
