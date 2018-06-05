export default async function getTweets (valueToSearch, nextResults) {
    let uri;
    if (nextResults === null) {
        uri = '/api/twitter/?search='+valueToSearch
    } else {
        uri = '/api/twitter/'+nextResults;
    }

    const response = await fetch(uri);

    return await response.json();
};