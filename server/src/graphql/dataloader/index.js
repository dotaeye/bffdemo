const DataLoader = require('dataloader')

module.exports = ({ services: { BookService } }) => ({
  bookDataloader: new DataLoader(
    async keys => {
      const requests = keys.map(x => BookService.getBookById(x))
      return await Promise.all(requests)
    },
    { cacheKeyFn: key => key.toString() }
  )
})
