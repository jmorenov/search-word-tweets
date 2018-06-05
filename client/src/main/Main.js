import React, { Component } from 'react';

import './Main.css';
import TweetsList from "../tweets-list/TweetsList";
import getTweets from './TwitterService';

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

        if (this.input !== '') {
            this.setState(this.applyInitialState());
            this.onSearch(this.input.value, null);
        }
    }

    onMoreSearch = (e) =>
        this.onSearch(this.input.value, this.state.nextResults);

    onSearch = (value, nextResults) => {
        this.setState({isLoading: true});
        getTweets(value, nextResults).then(result => this.onSetResult(result, nextResults));
    }

    applyUpdateResult = (result) => (prevState) => ({
        tweets: [...prevState.tweets, ...result.tweets],
        nextResults: result.next_results,
        isLoading: false
    });

    applySetResult = (result) => (prevState) => ({
        tweets: result.tweets,
        nextResults: result.next_results,
        isLoading: false
    });

    applyEmptyResult = (result) => (prevState) => ({
        tweets: prevState.tweets,
        nextResults: null,
        isLoading: false
    })

    applyInitialState = () => ({
        tweets: [],
        nextResults: null,
        isLoading: false
    })

    onSetResult = (result, nextResults) => {
        if (result.tweets.length > 0) {
            if (nextResults === null) {
                this.setState(this.applySetResult(result))
            } else {
                this.setState(this.applyUpdateResult(result));
            }
        } else {
            this.setState(this.applyEmptyResult(result));
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