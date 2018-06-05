const express = require('express');
const rp = require('request-promise');
const authorization = require('./authorization.js');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/twitter/', (req, res) => {
    var options = {
        json: true
    };

    if ('search' in req.query) {
        const search = req.query.search;

        options.uri = 'https://api.twitter.com/1.1/search/tweets.json';
        options.qs = {
            q: search,
            result_type: 'popular',
        };

        options.headers = {
            'User-Agent': 'Request-Promise',
            'Authorization': authorization.getAuthorization('GET', 'https://api.twitter.com/1.1/search/tweets.json',
                { 'q': search, 'result_type': 'popular'})
        };
    } else {
        options.uri = 'https://api.twitter.com/1.1/search/tweets.json';
        options.qs = req.query;
        options.headers = {
            'User-Agent': 'Request-Promise',
            'Authorization': authorization.getAuthorization('GET', 'https://api.twitter.com/1.1/search/tweets.json',
                req.query)
        };
    }

    rp(options)
        .then(function (repos) {
            const tweets = repos.statuses.map(tweet => ({
                id: tweet.id_str,
                text: tweet.text,
                url: 'https://twitter.com/statuses/' + tweet.id_str
            }));
            const next_results = repos.search_metadata.next_results;

            res.send({
                tweets: tweets,
                next_results: next_results || ""
            });
        })
        .catch(function (err) {
          res.send(err);
        });
});

app.listen(port, () => console.log(`Listening on port ${port}`));