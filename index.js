/**
 * @author geek-bigniu
 * @file index.js
 * @description 从文件中读取 JSON 数据，调用翻译接口进行翻译，将翻译结果写入文件
 * @usage node index.js
 * 
 */
const { getToken } = require('./tokenManager');
const { readJsonFile, writeJsonFile } = require('./fileManager');
const { translateJson } = require('./translator');
const path = require('path');
// 目标语言列表
const langs = ['en', 'ja'];
// 输入文件路径
const inputFilePath = 'locales/zh.json';
// 输出文件夹
const outputDir = 'locales';
(async () => {
    try {
        const token = await getToken();
        console.log('获取到的Token:', token);
        const originalJson = await readJsonFile(inputFilePath);
        // 创建翻译任务
        const translationTasks = langs.map(lang => {
            // 翻译 JSON 数据
            console.log(`开始翻译 ${lang}...`);
            return translateJson(originalJson, lang, token)
                .then(translatedJson => {
                    // 写入翻译结果
                    console.log(`写入文件 ${lang}.json...`);
                    const outputFilePath = path.join(outputDir, `${lang}`+'.json');
                    return writeJsonFile(outputFilePath, translatedJson);
                });
        });

        await Promise.all(translationTasks);

        console.log('所有翻译任务已完成');
    } catch (error) {
        console.trace(error);
    }
})();
