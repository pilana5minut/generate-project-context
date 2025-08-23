const fs = require('fs/promises')
const path = require('path')

async function readFileContents(files, outputPath, tree) {
  const errors = []
  const contents = []
  const timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/Paris',
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
      const content = await fs.readFile(file, 'utf-8')
      contents.push(
        `///////////////////////////////////////////////////////////////////////////////\n// ${file}\n///////////////////////////////////////////////////////////////////////////////\n\n${content}\n\n///////////////////////////////////////////////////////////////////////////////`
      )
    } catch (err) {
      console.warn(`Failed to read ${file}: ${err.message}`)
      errors.push(`${file}: ${err.message}`)
    }
  }

  let output = `Generated on: ${timestamp}\n\n`
  if (errors.length > 0) {
    output += 'Files with errors:\n' + errors.map((err) => `- ${err}`).join('\n') + '\n\n'
  }
  output += tree + '\n\n'
  output += contents.join('\n')

  await fs.writeFile(outputPath, output, 'utf-8')
}

module.exports = { readFileContents }
