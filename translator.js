const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// 调用翻译接口进行翻译
function translateText(text, targetLang, token) {
    const url = `https://api-edge.cognitive.microsofttranslator.com/translate?from=&to=${targetLang}&api-version=3.0&includeSentenceLength=true`;

    // 创建一个axios实例
    const instance = axios.create({
        timeout: 30000, // 设置超时时间为30秒
    });

    // 使用axios-retry配置重试机制
    axiosRetry(instance, {
        retries: 3, // 设置重试次数
        retryDelay: (retryCount) => {
            return retryCount * 1000; // 设置重试延迟时间 (retryCount * 1000ms) 
        },
        retryCondition: (error) => {
            // 如果请求发生网络错误或超时，则进行重试
            return error.code === 'ECONNABORTED' || axiosRetry.isNetworkOrIdempotentRequestError(error);
        },
    });
    return instance.post(url, [{ Text: text }], {
        headers: {
            'Authorization': 'Bearer ' + token,
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            'Content-Type': 'application/json'
        }
    }).then(response => {
        // 解析翻译结果 
        if (response.data && response.data[0] && response.data[0].translations && response.data[0].translations[0]) {
            return response.data[0].translations[0].text;
        } else {
            throw new Error('Translation failed');
        }
    });
}

// 递归翻译JSON对象
function translateJson(json, targetLang, token) {
    const promises = Object.keys(json).map(async (key) => {
        
        if (typeof json[key] === 'object') {
            // 如果值是对象，则递归翻译
            return translateJson(json[key], targetLang, token).then(translated => ({ [key]: translated }));
        } else {
            // 如果值是字符串，则调用翻译接口翻译
            return { [key]: await translateText(json[key], targetLang, token) };
        }
    });

    return Promise.all(promises).then(results => {
        // 将所有翻译结果合并为一个对象
        return results.reduce((acc, curr) => Object.assign(acc, curr), {});
    });
}

module.exports = {
    translateJson
};
