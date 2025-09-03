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
      // Директории
      'node_modules',
      'node_modules/**',
      '**/node_modules/**',
      'node_modules/*',
      '**/node_modules/*',
      '.git',
      '.git/**',
      '**/.git/**',
      'dist',
      'dist/**',
      'build',
      'build/**',
      'out',
      'out/**',
      'coverage',
      'coverage/**',
      '.cache',
      '.cache/**',
      '.parcel-cache',
      '.parcel-cache/**',
      '.vite',
      '.vite/**',
      'logs',
      'logs/**',
      'log',
      'log/**',
      'tmp',
      'tmp/**',
      'temp',
      'temp/**',
      '.vscode',
      '.vscode/**',
      '.idea',
      '.idea/**',
      // Файлы
      '.gitignore',
      'package-lock.json',
      'project_context.md',
      'yarn.lock',
      'pnpm-lock.yaml',
      '.DS_Store',
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      'npm-debug.log',
      'yarn-error.log',
      'yarn-debug.log',
      '.eslintcache',
      'tsconfig.tsbuildinfo',
    ].concat(patterns)
  } catch (err) {
    console.error('Failed to read .ignoreList:', err.message)
    return [
      // Директории
      'node_modules',
      'node_modules/**',
      '**/node_modules/**',
      'node_modules/*',
      '**/node_modules/*',
      '.git',
      '.git/**',
      '**/.git/**',
      'dist',
      'dist/**',
      'build',
      'build/**',
      'out',
      'out/**',
      'coverage',
      'coverage/**',
      '.cache',
      '.cache/**',
      '.parcel-cache',
      '.parcel-cache/**',
      '.vite',
      '.vite/**',
      'logs',
      'logs/**',
      'log',
      'log/**',
      'tmp',
      'tmp/**',
      'temp',
      'temp/**',
      '.vscode',
      '.vscode/**',
      '.idea',
      '.idea/**',
      // Файлы
      '.gitignore',
      'package-lock.json',
      'project_context.md',
      'yarn.lock',
      'pnpm-lock.yaml',
      '.DS_Store',
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      'npm-debug.log',
      'yarn-error.log',
      'yarn-debug.log',
      '.eslintcache',
      'tsconfig.tsbuildinfo',
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
