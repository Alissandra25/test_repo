import React from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import ArticleModal from "./ArticleModal";

class ArticleList extends React.Component {
  state = {
    page: 0,
    articleList: [],
    showModal: false,
    modalArticleIndex: null,
    filter: {
      field: "",
      value: "",
    },
    search: "",
  };

  timeInterval = null;
  scrollListener = null;
  isLoading = false;

  componentDidMount() {
    this.getArticles();
    this.timeInterval = setInterval(this.getArticles, 10000);
    this.scrollListener = window.addEventListener("scroll", () => {
      if (this.scrollListener) {
        this.scrollListener.removeEventListener();
      }
      this.handleScroll();
    });
  }

  handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      this.getArticles();
    } else return;
  };

  closeModal = () => this.setState({ showModal: false });

  getArticles = () => {
    if (!this.isLoading) {
      const page = this.state.page;
      console.log(page);
      this.isLoading = true;
      axios
        .get(
          `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`
        )
        .then(async (data) => {
          await this.setState({
            articleList: [...this.state.articleList, ...data.data.hits],
            page: data.data.page + 1,
          });
          this.isLoading = false;
        });
    }
  };

  renderData() {
    let articles = this.state.articleList;
    const {
      filter: { field, value },
      search,
    } = this.state;

    if (field && value) {
      articles = articles.filter((article) => article[field] === value);
    }
    if (search) {
      articles = articles.filter((article) => {
        if (article.title && article.url && article.author) {
          return (
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.url.toLowerCase().includes(search.toLowerCase()) ||
            article.author.toLowerCase().includes(search.toLowerCase())
          );
        } else return false;
      });
    }
    return articles.map((article, index) => (
      <tr
        key={index + "_" + article.created_at + "_" + article.author}
        onClick={() =>
          this.setState({ showModal: true, modalArticleIndex: index })
        }
      >
        <td>{article.title}</td>
        <td>{article.url}</td>
        <td>{article.created_at}</td>
        <td>{article.author}</td>
      </tr>
    ));
  }

  getOptions(field) {
    const articleDates = new Set(
      this.state.articleList.map((article) => article[field])
    );
    return Array.from(articleDates).map((date) => (
      <option key={date}>{date}</option>
    ));
  }

  changeFilter = (event, field) => {
    const { value } = event.target;
    if (value === "Created at" || value === "Title") {
      this.setState({ filter: { field, value: "" } });
      return;
    }
    this.setState({ filter: { field, value } });
  };

  search = (event) => {
    const { value } = event.target;
    this.setState({ search: value });
  };

  render() {
    const { articleList, modalArticleIndex, showModal } = this.state;
    return (
      <div className="content">
        <ArticleModal
          handleClose={this.closeModal}
          show={showModal}
          data={articleList[modalArticleIndex]}
        />
        <div className="d-flex justify-content-end m-1">
          <input type="search" placeholder="search" onChange={this.search} />
        </div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>
                <select onChange={(event) => this.changeFilter(event, "title")}>
                  <option>Title</option>
                  {this.getOptions("title")}
                </select>
              </th>
              <th>URL</th>
              <th>
                <select
                  onChange={(event) => this.changeFilter(event, "created_at")}
                >
                  <option>Created at</option>
                  {this.getOptions("created_at")}
                </select>
              </th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>{this.renderData()}</tbody>
        </Table>
      </div>
    );
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    this.scrollListener.removeEventListener();
  }
}

export default ArticleList;
