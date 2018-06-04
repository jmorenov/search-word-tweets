const express = require('express');
const rp = require('request-promise');
const authorization = require('./authorization.js');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/twitter/', (req, res) => {
    const search = JSON.parse(req.query.search);

    var options = {
      uri: 'https://api.twitter.com/1.1/search/tweets.json',
      qs: {
          q: search,
          result_type: 'popular',
      },
      headers: {
          'User-Agent': 'Request-Promise',
          'Authorization': authorization.getAuthorization('GET', 'https://api.twitter.com/1.1/search/tweets.json',
              { 'q': search, 'result_type': 'popular'})
      },
      json: true // Automatically parses the JSON string in the response
    };

    rp(options)
        .then(function (repos) {
          res.send({ express: repos });
        })
        .catch(function (err) {
          res.send({ express: err});
        });
});

app.listen(port, () => console.log(`Listening on port ${port}`));