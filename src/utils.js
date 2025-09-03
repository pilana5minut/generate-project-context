// src/utils.js
const fs = require('fs/promises')
const path = require('path')
const open = require('open')

async function findProjectRoot(startDir) {
  let currentDir = startDir
  while (currentDir !== path.parse(currentDir).root) {
    try {
      await fs.access(path.join(currentDir, 'package.json'))
      return currentDir
    } catch {
      currentDir = path.dirname(currentDir)
    }
  }
  console.warn('package.json not found. Using current directory:', startDir)
  return startDir
}

function getIgnoreListPath() {
  return path.join(__dirname, '..', '.ignoreList')
}

async function createIgnoreList() {
  const ignoreListPath = getIgnoreListPath()
  const defaultContent = `# Automatically ignored files and directories:
# - node_modules, .git, dist, build, out, coverage, .cache, .parcel-cache, .vite, logs, log, tmp, temp, .vscode, .idea
# - .gitignore, package-lock.json, project_context.md, yarn.lock, pnpm-lock.yaml, .DS_Store, .env, .env.local, .env.development, .env.production, npm-debug.log, yarn-error.log, yarn-debug.log, .eslintcache, tsconfig.tsbuildinfo
# Add additional patterns to ignore here, if necessary
`
  await fs.writeFile(ignoreListPath, defaultContent, 'utf-8')
  console.log('Created .ignoreList at:', ignoreListPath)
}

async function checkIgnoreList(openAfterCreate = false) {
  const ignoreListPath = getIgnoreListPath()
  try {
    await fs.access(ignoreListPath)
  } catch {
    console.error('.ignoreList not found at:', ignoreListPath)
    if (openAfterCreate) {
      console.log('Creating default .ignoreList...')
      await createIgnoreList()
    } else {
      console.error('Please run "npx generate-context ignore" to create .ignoreList.')
      process.exit(1)
    }
  }
}

async function openIgnoreList() {
  const ignoreListPath = getIgnoreListPath()
  try {
    await open(ignoreListPath)
    console.log('Opened .ignoreList in default editor')
  } catch (err) {
    console.error('Failed to open .ignoreList:', err.message)
    process.exit(1)
  }
}

module.exports = {
  findProjectRoot,
  getIgnoreListPath,
  checkIgnoreList,
  createIgnoreList,
  openIgnoreList,
}
