import logo from './logo.svg';
import './App.css';
import React from 'react';


function Article(props) {

  const articleData = props.articleData;
  const title = articleData.title;
  const url = articleData.url;
  const imageUrl = articleData.imageUrl;
  const adjustedImageUrl = imageUrl + '&height=100';
  const onChangeEdit = props.onChangeEdit;
  // subrtacting 10 from articleWidth to adjust for the css margins
  const articleWidth = props.columnWidth * articleData.width - 10;

  return (
    <article
      className='Article'
      style={{
        width: articleWidth,
      }}
    >
      <button className='Edit-button' onClick={props.onClickEdit()}>
        Edit
      </button>


      { // Using ternary over large parts because I found no good way of
        // disabling the <a> tag's linking while still allowing for editing of
        // the text area.
        (props.editIndex) ? (
          <span>
            <img src={adjustedImageUrl} />
            <span>
              <textarea
                className='Edit-text-area'
                defaultValue={title}
                onChange={onChangeEdit()}
              ></textarea>
            </span>
          </span>
        ) : (
          <a
            href={url}
            style={{
              width: articleWidth,
            }}
          >
            <img src={adjustedImageUrl} />
            <span>
              <h3>
                {title}
              </h3>
            </span>
          </a>
        )}
    </article >

  )
}

class ArticleRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      row: this.props.row,
      rowWidth: this.props.rowWidth,
    };
  }

  render() {
    const columns = this.state.row.columns;
    const rowWidth = this.state.rowWidth;
    const columnWidth = rowWidth / 12;
    const editIndex = this.props.editIndex;
    const onClickEdit = this.props.onClickEdit;
    const onChangeEdit = this.props.onChangeEdit;

    const content = columns.map((article, index) => {
      return (
        <Article
          articleData={article}
          columnWidth={columnWidth}
          editIndex={editIndex[index]}
          key={article.title}
          onClickEdit={onClickEdit(index)}
          onChangeEdit={onChangeEdit(index)}
        >
        </Article>
      )
    })

    return <div className="Row">{content}</div>
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      articleRows: null,
      width: 990,
      editIndex: null,
    }
  }

  async componentDidMount() {
    const url = "https://storage.googleapis.com/aller-structure-task/test_data.json";
    const response = await fetch(url);
    const data = await response.json();

    let editIndex = new Array(data[0].length)

    for (let i = 0; i < data[0].length; i++) {
      editIndex[i] = new Array(data[0][i].columns.length);
      editIndex[i].fill(false);
    }

    this.setState({
      articleRows: data[0],
      editIndex: editIndex,
    })
  }

  handleClickEdit(rowIndex, articleIndex) {
    const editIndex = this.state.editIndex;

    editIndex[rowIndex][articleIndex] = !editIndex[rowIndex][articleIndex];

    this.setState({
      editIndex: editIndex,
    });
  }

  handleChangeEdit(rowIndex, articleIndex, event) {
    const articleRows = this.state.articleRows;

    articleRows[rowIndex].columns[articleIndex].title = event.target.value;

    this.setState({
      articleRows: articleRows,
    });
  }

  render() {
    const articleRows = this.state.articleRows;
    const width = this.state.width;
    const editIndex = this.state.editIndex;

    if (!articleRows) return;

    const rows = articleRows.map((row, index) => {
      return (
        <ArticleRow
          row={row}
          rowWidth={width}
          editIndex={editIndex[index]}
          key={row.columns[0].title}
          onClickEdit={
            (artIndex) => {
              return (articleIndex = artIndex, rowIndex = index) => {
                return () => this.handleClickEdit(rowIndex, articleIndex)
              }
            }
          }
          onChangeEdit={
            (artIndex) => {
              return (articleIndex = artIndex, rowIndex = index) => {
                return (event) => this.handleChangeEdit(rowIndex, articleIndex, event)
              }
            }
          }
        ></ArticleRow>
      )
    })

    return (
      <div className='App'>
        <div
          className='Main'
          style={{ width: width }}
        >
          {rows}
        </div>
      </div>)
  }
};




export default App;