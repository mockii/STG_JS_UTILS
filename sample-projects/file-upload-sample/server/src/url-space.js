var urlSpace = (function () {

    return {

        urls: {
            local: {
                upload: '/api/upload'
            },
            remote: {

            }
        },
        headers: {
            adams: {
                accept: {
                    v1: 'application/vnd.adams-v1.0+json'
                }
            },
            contentType: {
                name: 'Content-Type',
                json: 'application/json',
                html: 'text/html'
            }
        }
    };

})();

module.exports = urlSpace;