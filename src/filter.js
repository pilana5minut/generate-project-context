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
