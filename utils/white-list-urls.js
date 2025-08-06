const whiteListUrls = [
    '/swagger-ui',
    '/.well-known/appspecific/com.chrome.devtools.json'
];

function checkForWhiteListUrls(urlFragment) {
    for (const url of whiteListUrls) {
        if (urlFragment.includes(url)) {
            return true;
        }
    }
}
module.exports = checkForWhiteListUrls;