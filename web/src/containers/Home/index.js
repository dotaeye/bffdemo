import React, { Component } from 'react';
import { request } from '../../utils/request';
import './index.less';

const gql = `
query searchBook(
  $keyword: String
  $bookId: ID!
  $showDetailBook: Boolean = true
  $showChapter: Boolean = false
  $skipChapterList: Boolean = true
) {
  books: searchBook(
    keyword: $keyword
    showChapter: $showChapter
    skipChapterList: $skipChapterList
  ) {
    ...bookFragment
    longIntro
    chapterInfo @include(if: $showChapter) {
      chapters {
        ...chapterFragment
      }
    }
    chapterInfoList(first: 10) @skip(if: $skipChapterList) {
      ...chapterFragment
    }
  }
  bookItem: getBookById(id: $bookId) @include(if: $showDetailBook) {
    ...bookFragment
  }
}

fragment bookFragment on Book {
  _id
  title
}
fragment chapterFragment on Chapter {
  title
  link
  unreadble
}

`;

export default class Home extends Component {
  state = {
    loading: true,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    const result = await request(
      gql,
      {
        keyword: '我是全能大明星',
        bookId: '58b511c27f4aaab27a91ecab',
        showChapter: false,
        skipChapterList: false,
      },
      {
        auth: true,
      }
    );
    this.setState({
      loading: false,
      queryResult: result,
    });
  }

  renderBooks() {
    const { books, bookItem } = this.state.queryResult;
    return (
      <div className="book-list">
        <div className="book-list-item single">
          <p>书本ID：{bookItem._id}</p>
          <p>书名：{bookItem.title}</p>
        </div>

        {books.map(b => (
          <div className="book-list-item" key={b._id}>
            <p>书本ID：{b._id}</p>
            <p>书名：{b.title}</p>
            <div className="book-chapter-list">
              {b.chapterInfoList.map((c, index) => (
                <div className="book-chapter-list-item" key={index}>
                  <p>{c.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="page-container">
        {loading ? (
          <div>
            <p>Graphql 加载数据!</p>
          </div>
        ) : (
          this.renderBooks()
        )}
      </div>
    );
  }
}
