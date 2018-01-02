'use strict';

class InternetService {
    checkConnection(){
        return new Promise((resolve) => {
            require('dns').lookup('google.com',function(err) {
                if (err && err.code == "ENOTFOUND") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = new InternetService();