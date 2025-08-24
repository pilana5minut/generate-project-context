const fs = require('fs/promises')
const path = require('path')

// Функция для определения, является ли файл текстовым
async function isTextFile(filePath) {
  try {
    // Читаем первые 1024 байта файла для анализа
    const buffer = await fs.readFile(filePath)
    const sample = buffer.slice(0, 1024)

    // Проверяем наличие null-байтов (признак бинарного файла)
    if (sample.includes(0)) {
      return false
    }

    // Проверяем, можно ли декодировать как UTF-8
    try {
      sample.toString('utf-8')
      return true
    } catch {
      return false
    }
  } catch (err) {
    // Если не можем прочитать файл, считаем его бинарным
    return false
  }
}

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

  const separator = '/'.repeat(79) // Ровно 79 слешей

  for (const file of files) {
    try {
      // Проверяем, является ли файл директорией
      const stats = await fs.stat(file)
      if (stats.isDirectory()) {
        continue
      }

      // Пропускаем node_modules
      if (file.includes('node_modules')) {
        console.log(`Skipping ${file} because it is in node_modules`)
        continue
      }

      // Получаем относительный путь для отображения
      const relativePath = path.relative(process.cwd(), file)

      // Проверяем, является ли файл текстовым
      const isText = await isTextFile(file)

      if (isText) {
        // Читаем текстовый файл
        const content = await fs.readFile(file, 'utf-8')
        contents.push(
          `${separator}\n// ${relativePath}\n${separator}\n\n${content}\n\n${separator}`
        )
      } else {
        // Для бинарных файлов показываем информационное сообщение
        const binaryMessage = '[Binary file content - not displayed]'
        contents.push(
          `${separator}\n// ${relativePath}\n${separator}\n\n${binaryMessage}\n\n${separator}`
        )
      }
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
  output += contents.join('')

  await fs.writeFile(outputPath, output, 'utf-8')
}

module.exports = { readFileContents }
