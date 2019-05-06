import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from '../filter'
function FakeRequest(data, delay) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay || 1000)
  })
}

module.exports = {
  Query: {
    getReadById: combineResolvers(
      isAuthenticated,
      async (root, { id }, { services: { BookService }, user }) => {
        if (id === 'error_id') {
          throw new Error('错误的id')
        }
        return await BookService.getBookById(id)
      }
    ),
    getBookById: combineResolvers(
      isAuthenticated,
      async (root, { id }, { services: { BookService }, user }) => {
        if (id === 'error_id') {
          throw new Error('错误的id')
        }
        return await BookService.getBookById(id)
      }
    ),
    searchBook: combineResolvers(
      isAuthenticated,
      async (
        root,
        { keyword },
        { services: { BookService }, user, pubsub }
      ) => {
        const result = await BookService.searchBook(keyword)
        pubsub.publish('SearchBookSub', { SearchBookSub: result[0] || {} })
        return result
      }
    )
  },

  Subscription: {
    SearchBookSub: {
      subscribe: (root, args, { pubsub }) =>
        pubsub.asyncIterator('SearchBookSub')
    }
  },
  Book: {
    longIntro: async (root, data, context) => {
      return root.longIntro || root.shortIntro
    },
    chapterInfo: async (root, data, { services: { BookService }, user }) => {
      await FakeRequest(1, 5000)
      return await BookService.getChapterInfo(root._id)
    },
    chapterInfoList: async (
      root,
      { first },
      { services: { BookService }, user }
    ) => {
      const chapterResult = await BookService.getChapterInfo(root._id)
      return chapterResult.chapters.splice(0, first)
    }
  },
  Read: {
    __resolveType(root, context, info) {
      if (root.author) {
        return 'Book'
      }

      if (root.link) {
        return 'Chapter'
      }

      return null
    }
  }
}
