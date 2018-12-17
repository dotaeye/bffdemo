import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { request } from "./request";

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

console.disableYellowBox = true;

export default class App extends Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    const result = await request(
      gql,
      {
        keyword: "我是全能大明星",
        bookId: "58b511c27f4aaab27a91ecab",
        showChapter: false,
        skipChapterList: false
      },
      {
        auth: true
      }
    );
    this.setState({
      loading: false,
      queryResult: result
    });
  }

  renderBooks() {
    const { books, bookItem } = this.state.queryResult;
    return (
      <View
        style={{
          flex: 1,
          paddingTop: 50
        }}
      >
        <View style={[styles.bookItem, styles.singleQuery]}>
          <Text>书本ID：{bookItem._id}</Text>
          <Text>书名：{bookItem.title}</Text>
        </View>

        {books.map(b => (
          <View key={b._id} style={[styles.bookItem]}>
            <Text>书本ID：{b._id}</Text>
            <Text>书名：{b.title}</Text>
            <View style={styles.chapters}>
              {b.chapterInfoList.map((c, index) => (
                <View key={index} style={styles.chapterItem}>
                  <Text>{c.title}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const { loading, queryResult } = this.state;
    return (
      <View style={styles.container}>
        {loading ? (
          <View>
            <ActivityIndicator />
            <Text style={styles.welcome}>Graphql 加载数据!</Text>
          </View>
        ) : (
          this.renderBooks()
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },

  bookItem: {
    padding: 10
  },

  singleQuery: {
    backgroundColor: "#ddd"
  },

  chapters: {
    marginTop: 20,
    padding: 15
  },
  chapterItem: {
    marginBottom: 10
  },

  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },

  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
