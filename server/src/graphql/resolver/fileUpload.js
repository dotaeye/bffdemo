import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from '../filter'
function FakeRequest(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), 1000)
  })
}

module.exports = {
  Query: {
    uploadFiles: combineResolvers(
      isAuthenticated,
      async (root, data, { services: { BookService }, user }) => {
        return await FakeRequest([])
      }
    )
  },

  Mutation: {
    singleUpload: combineResolvers(
      isAuthenticated,
      async (root, { file }, { services: { FileUploadService }, user }) => {
        return await FileUploadService.uploadFile(file)
      }
    ),
    multipleUpload: combineResolvers(
      isAuthenticated,
      async (root, { files }, { services: { FileUploadService } }) => {
        const promises = files.map(f => FileUploadService.uploadFile(f))
        const result = await Promise.all(promises)
        return result
      }
    )
  }
}
