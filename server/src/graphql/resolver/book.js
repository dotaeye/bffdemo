import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from '../filter'
function FakeRequest(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), 1000)
  })
}

module.exports = {
  Query: {
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
  }
}
