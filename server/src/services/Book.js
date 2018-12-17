import axios from 'axios'
import qs from 'query-string'
import config from '../config'

function FakeRequest(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), 1000)
  })
}

export const searchBook = async keyword => {
  console.log('searchBook')

  const res = await axios.get(
    `http://api.zhuishushenqi.com/book/fuzzy-search?${qs.stringify({
      query: keyword
    })}`
  )
  return res.data.books
}

export const getBookById = async id => {
  const url = `http://api.zhuishushenqi.com/book/${id}`
  console.log(url)
  const res = await axios.get(url)
  return res.data
}

export const getChapterInfo = async id => {
  const res = await axios.get(
    `http://api.zhuishushenqi.com/mix-atoc/${id}?view=chapters`
  )
  const chapterRes = res.data.mixToc || {
    chapters: [],
    chaptersCount1: 0
  }
  return {
    chapters: chapterRes.chapters,
    chaptersCount: chapterRes.chaptersCount1
  }
}
