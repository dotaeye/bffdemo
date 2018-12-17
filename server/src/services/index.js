import fs from 'fs'
import path from 'path'

const services = {}

fs.readdirSync(__dirname).forEach(filename => {
  filename = filename.replace('.js', '')
  if (filename === 'index') return
  services[filename + 'Service'] = require(path.join(__dirname, filename))
})

export default services
