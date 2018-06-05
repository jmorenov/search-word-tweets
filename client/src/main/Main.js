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
            isLoading: false,
            count: 0,
            actualValue: null,
            latestSearches: this.getAllSearches()
        };
    }

    onInitialSearch = (e) => {
        e.preventDefault();

        if (this.input !== '') {
            this.setState(this.applyInitialState());
            this.onSearch(this.input.value, null);
        }
    }

    updateLatestSearches = (value) => {
        if (value) {
            this.setNewSearch(value);
            this.setState({latestSearches: this.getAllSearches(), count: 0});
        }
    }

    reDoSearch = (search) => {
        this.updateLatestSearches();
        this.setState(this.applyInitialState());
        this.input.value = search;
        this.onSearch(search, null);
    }

    onMoreSearch = (e) =>
        this.onSearch(this.input.value, this.state.nextResults);

    onSearch = (value, nextResults) => {
        this.setState({isLoading: true});
        this.updateLatestSearches(value);

        getTweets(value, nextResults).then(result => this.onSetResult(result, nextResults));
    }

    applyUpdateResult = (result) => (prevState) => ({
        tweets: [...prevState.tweets, ...result.tweets],
        nextResults: result.next_results,
        isLoading: false,
        count: prevState.count + result.count
    })

    applySetResult = (result) => (prevState) => ({
        tweets: result.tweets,
        nextResults: result.next_results,
        isLoading: false,
        count: result.count
    })

    applyEmptyResult = (result) => (prevState) => ({
        tweets: prevState.tweets,
        nextResults: null,
        isLoading: false,
        count: prevState.count
    })

    applyInitialState = (result) => ({
        tweets: [],
        nextResults: null,
        isLoading: false,
        actualValue: this.input.value
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

    getAllSearches = () => {
        let latestSearches = localStorage.getItem('latestSearches');

        if (latestSearches) {
            return JSON.parse(latestSearches);
        } else {
            return [];
        }
    }

    setNewSearch = (search, count) => {
        let latestSearches = localStorage.getItem('latestSearches');

        if (latestSearches) {
            latestSearches = JSON.parse(latestSearches);
            if (latestSearches.find(item => item.search === search)) {
                return;
            }

            localStorage.clear();
        } else {
            latestSearches = [];
        }

        latestSearches.push({search: search, count: count});
        localStorage.setItem('latestSearches', JSON.stringify(latestSearches));
    }

    render() {
      return (
          <div className="page">
              <div className="latest-searches">
                  <h1>Latest Searches</h1>
                  {this.state.latestSearches.map(item => <div key={item.search}>
                     <a onClick={this.reDoSearch.bind(this, item.search)}>{item.search}</a>
                  </div>)}
                  {!this.state.latestSearches.length && <span>No search made</span>}
              </div>
              <h1>New Search</h1>
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