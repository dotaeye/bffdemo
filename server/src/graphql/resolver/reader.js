import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from '../filter'
function FakeRequest(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), 1000)
  })
}

module.exports = {
  Query: {
    getReaders: combineResolvers(
      isAuthenticated,
      async (root, data, { services: { BookService }, user }) => {
        // 这里有三本书，但是有四条记录，测试结果是只对Book查询三次
        const mockData = [
          {
            _id: 'reader1',
            name: 'reader1',
            bookId: '5a2a5034d49a4af4306f9812'
          },
          {
            _id: 'reader2',
            name: 'reader2',
            bookId: '54b704567c4ab53e40ee3590'
          },
          {
            _id: 'reader3',
            name: 'reader3',
            bookId: '56613ccb0981d7d217e50d52'
          },
          {
            _id: 'reader4',
            name: 'reader4',
            bookId: '56613ccb0981d7d217e50d52'
          }
        ]
        return await FakeRequest(mockData)
      }
    )
  },

  Reader: {
    book: (root, data, { dataloaders: { bookDataloader } }) => {
      return bookDataloader.load(root.bookId)
    }
  }
}
