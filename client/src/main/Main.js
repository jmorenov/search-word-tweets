import React, { Component } from 'react';

import './Main.css';
import TweetsList from "../tweets-list/TweetsList";
import getTweets from './TwitterService';

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

class Main extends Component {
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
              <div className="search-box">
                  <form type="submit" onSubmit={this.onInitialSearch}>
                      <input type="text" ref={node => this.input = node} />
                      <button type="submit">Search</button>
                  </form>
              </div>

              <TweetsList
                  valueSearched={this.input}
                  list={this.state.tweets}
                  isLoading={this.state.isLoading}
                  nextResults={this.state.nextResults}
                  onMoreSearch={this.onMoreSearch}
              />
          </div>
      );
    }
}

export default Main;