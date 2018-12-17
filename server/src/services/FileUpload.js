import * as mkdirp from 'mkdirp'
import * as shortid from 'shortid'
import { createWriteStream } from 'fs'
import config from '../config'

const uploadDir = './uploads'

// Ensure upload directory exists
mkdirp.sync(uploadDir)

export const uploadFile = async file => {
  const { filename, stream, mimetype, encoding } = await file
  const id = shortid.generate()
  const path = `${uploadDir}/${id}-${filename}`

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path, filename, mimetype, encoding }))
      .on('error', reject)
  )
}
