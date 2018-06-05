const express = require('express');
const rp = require('request-promise');
const authorization = require('./authorization.js');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/twitter/', (req, res) => {
    var options = {
        uri: 'https://api.twitter.com/1.1/search/tweets.json',
        json: true
    };

    if ('search' in req.query) {
        options.qs = {
            q: req.query.search,
            result_type: 'popular',
        };
    } else {
        options.qs = req.query;
    }

    options.headers = {
        'User-Agent': 'Request-Promise',
        'Authorization': authorization.getAuthorization('GET', 'https://api.twitter.com/1.1/search/tweets.json',
            options.qs)
    };

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