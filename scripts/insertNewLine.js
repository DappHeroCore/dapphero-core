const fs = require('fs')
const path = require('path')

const NEW_LINE_CONTENTS = `import { logger } from 'logger'`
const readDir = (dirPath) => {

  for (const dirent of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const filePath = dirent.name
    if (fs.lstatSync(path.resolve(dirPath, filePath)).isDirectory()) {
      readDir(path.resolve(dirPath, filePath))
    } else {
      const fileContents = fs.readFileSync(path.resolve(dirPath, filePath)).toString()
      if (fileContents.match('console.log')
        && (filePath.split('.').includes('ts') || filePath.split('.').includes('tsx'))
      ) {
        console.log('filePath')
        fs.writeFileSync(path.resolve(dirPath, filePath), `${NEW_LINE_CONTENTS}\n${fileContents}`)
      }
    }
  }
}

readDir('src')
