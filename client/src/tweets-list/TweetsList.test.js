import React from 'react';
import ReactDOM from 'react-dom';
import TweetsList from './TweetsList';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TweetsList />, div);
});