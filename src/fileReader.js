// src/fileReader.js
const fs = require('fs/promises')
const path = require('path')

async function isTextFile(filePath) {
  try {
    const buffer = await fs.readFile(filePath)
    const sample = buffer.slice(0, 1024)
    if (sample.includes(0)) {
      return false
    }
    try {
      sample.toString('utf-8')
      return true
    } catch {
      return false
    }
  } catch (err) {
    return false
  }
}

function getCodeBlockLanguage(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  return extension ? extension.slice(1) : ''
}

async function readFileContents(files, outputPath, treeOutput, fileCount, isFromRoot) {
  const errors = []
  const contents = []
  const timestamp = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  for (const file of files) {
    try {
      const stats = await fs.stat(file)
      if (stats.isDirectory()) {
        continue
      }

      if (file.includes('node_modules')) {
        console.log(`Skipping ${file} because it is in node_modules`)
        continue
      }

      const relativePath = path.relative(process.cwd(), file)
      const isText = await isTextFile(file)

      if (isText) {
        const content = await fs.readFile(file, 'utf-8')
        const language = getCodeBlockLanguage(file)
        contents.push(`### ${relativePath}\n\`\`\`${language}\n${content}\n\`\`\`\n`)
      } else {
        contents.push(
          `### ${relativePath}\n\`\`\`\n[Binary file content - not displayed]\n\`\`\`\n`
        )
      }
    } catch (err) {
      console.warn(`Failed to read ${file}: ${err.message}`)
      errors.push(`${file}: ${err.message}`)
    }
  }

  let output = `# Generated on: ${timestamp}\n\n`
  if (errors.length > 0) {
    output += `## Errors:\nBelow is a list of files that could not be read:\n${errors
      .map((err) => `- ${err}`)
      .join('\n')}\n\n`
  }
  output += treeOutput
  if (contents.length > 0) {
    if (isFromRoot) {
      output += `## Files with the code for the entire project\nBelow is the code for all project files.\nTotal number of files presented here: **${fileCount}**\n\n`
    } else {
      output += `## Code files included in the above subtree\nBelow is the code for all files included in the above subtree.\nTotal number of files presented here: **${fileCount}**\n\n`
    }
  }
  output += contents.join('\n')

  await fs.writeFile(outputPath, output, 'utf-8')
}

module.exports = { readFileContents }
