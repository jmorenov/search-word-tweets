import React, { Component } from 'react';

import './App.css';

const applyUpdateResult = (result) => (prevState) => ({
    tweets: [...prevState.tweets, ...result.tweets],
    nextResults: result.next_results,
    isLoading: false
});

const applySetResult = (result) => (prevState) => ({
    tweets: result.tweets,
    nextResults: result.next_results,
    isLoading: false
});

const applyEmptyResult = (result) => (prevState) => ({
    tweets: prevState.tweets,
    nextResults: null,
    isLoading: false
});

const applyInitialState = () => ({
    tweets: [],
    nextResults: null,
    isLoading: false
});

const getTweets = async (valueToSearch, nextResults) => {
  var uri;
  if (nextResults === null) {
    uri = '/api/twitter/?search='+valueToSearch
  } else {
    uri = '/api/twitter/'+nextResults;
  }

  const response = await fetch(uri);
  const body = await response.json();

  return body;
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tweets: [],
            nextResults: null,
            isLoading: false
        };
    }

    onInitialSearch = (e) => {
        e.preventDefault();

        if (this.input === '') {
            return;
        }

        this.setState(applyInitialState());

        this.fetchStories(this.input.value, null);
    }

    onMoreSearch = (e) =>
        this.fetchStories(this.input.value, this.state.nextResults);

    fetchStories = (value, nextResults) => {
        this.setState({isLoading: true});
        getTweets(value, nextResults).then(result => this.onSetResult(result, nextResults));
    }

    onSetResult = (result, nextResults) => {
        if (result.tweets.length > 0) {
            if (nextResults === null) {
                this.setState(applySetResult(result))
            } else {
                this.setState(applyUpdateResult(result));
            }
        } else {
            this.setState(applyEmptyResult(result));
        }
    }

    render() {
      return (
          <div className="page">
              <div className="interactions">
                  <form type="submit" onSubmit={this.onInitialSearch}>
                      <input type="text" ref={node => this.input = node} />
                      <button type="submit">Search</button>
                  </form>
              </div>

              <List
                  list={this.state.tweets}
                  isLoading={this.state.isLoading}
                  nextResults={this.state.nextResults}
                  onMoreSearch={this.onMoreSearch}
              />
          </div>
      );
    }
}

const List = ({ list, nextResults, isLoading, onMoreSearch }) =>
    <div>
      <div className="list">
          {list.map(item => <div className="list-row" key={item.id}>
              <a href={item.url}>{item.text}</a>
          </div>)}
      </div>

      <div className="interactions">
          {isLoading && <span>Loading...</span>}
          {(nextResults && nextResults !== null && !isLoading) && <button type="button" onClick={onMoreSearch}>More</button>}
          {!nextResults && <span>No more results</span>}
      </div>
    </div>

export default App;