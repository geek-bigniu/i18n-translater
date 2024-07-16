const axios = require('axios');

// 获取新的Token
function getToken() {
    return new Promise((resolve, reject) => {
        const instance =  axios.create({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
            },
            timeout: 30000, // 设置超时时间为30秒
        });
        instance.get('https://edge.microsoft.com/translate/auth')
            .then(response => {
                const newToken = response.data;
                resolve(newToken);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = {
    getToken
};
