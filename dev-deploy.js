const moment = require('moment')

const { execSync } = require('child_process')

const dateTime = moment().format('MM-DD-YYYY')

// execSync(`cd dist && git add . && git commit -m \"Release at ${dateTime}\" && git push`, { stdio: [0, 1, 2]} );

execSync(`npm run build`, { stdio: [ 0 ] })
console.log('Build finished.')

const fileSource = `main-${dateTime}.js`
const newFileName = `build/static/js/${fileSource}`

execSync(`mv build/static/js/main.js ${newFileName}`, { studio: [ 0 ] })
console.log('File renamed')

execSync(`aws s3 cp ${newFileName} s3://package.dapphero.io/ --acl public-read`, { studio: [ 0 ] })
console.log('File Uploaded.')
console.log(`S3 Link: s3://package.dapphero.io/${fileSource}`)
