import React from "react";

import './TweetsList.css';

class TweetsList extends React.Component {
    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
        if (
            (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
            this.props.nextResults && this.props.nextResults !== null && !this.props.isLoading
        ) {
            this.props.onMoreSearch();
        }
    }

    getStatusElement = (params) => {
        if (params.isLoading) {
            return (<span>Loading...</span>);
        } else if (params.valueSearched) {
            if (!params.nextResults && params.list.length) {
                return (<span>No more results</span>);
            } else {
                return (<span>No results</span>);
            }
        }
    }

    render() {
        const params = this.props;
        return (
            <div>
                <div className="list">
                    {params.list.map(item => <div className="list-row" key={item.id}>
                        <a href={item.url}>{item.text}</a>
                    </div>)}
                </div>
                <div className="status">
                    {this.getStatusElement(params)}
                </div>
            </div>
        );
    };
}

export default TweetsList;