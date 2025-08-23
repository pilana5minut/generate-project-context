#!/usr/bin/env node

const { program } = require('commander')
const { generateContext } = require('./fileScanner')
const { checkIgnoreList, openIgnoreList } = require('./utils')

program
  .version('1.0.0')
  .description('Generate a project context file with directory tree and file contents')

program
  .command('ignore')
  .description('Open or create .ignoreList in the default editor')
  .action(async () => {
    await checkIgnoreList(true)
    await openIgnoreList()
  })

program.action(async () => {
  await checkIgnoreList()
  await generateContext(process.cwd())
})

program.parse(process.argv)
