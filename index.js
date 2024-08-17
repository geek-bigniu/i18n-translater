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
const langs = ["en","vi","tr","ru","pt","ms","ko","ja","id","es","it","th"];
// 输入文件路径
const inputFilePath = 'locales/zh.json';
// 输出文件夹
const outputDir = 'locales';
// 合并文件目录
const mergeDir = 'locales';
// 是否合并文件
const isMerge = true;
// 是否对比文件
const isDiff = true;


// 根据语言文件对比差异进行翻译
async function diffJsonFile(langPath, originLang, diffLang) {
    // 读取原始文件
    const originalJson =await readJsonFile(path.join(langPath, `${originLang}`+'.json'));
    // 读取对比文件
    const diffJson = await readJsonFile(path.join(langPath, `${diffLang}`+'.json'));
    //对比文件和原始文件的差异
    const diff = {};
   let orginKeys = Object.keys(originalJson);
   let diffKeys = Object.keys(diffJson);
    // 对比原始文件和对比文件的key值
    orginKeys.forEach(key => {
        if (!diffKeys.includes(key)) {
            diff[key] = originalJson[key];
        }
    });
    return diff;
}

(async () => {
    try {
        const token = await getToken();
        console.log('获取到的Token:', token);
        let originalJson ={}
        if(isDiff){
            originalJson =await diffJsonFile(mergeDir, 'zh', 'en');
        }else{
            originalJson = await readJsonFile(inputFilePath);
        }
       
        // 创建翻译任务
        const translationTasks = langs.map(lang => {
            // 翻译 JSON 数据
            console.log(`开始翻译 ${lang}`);
            return translateJson(originalJson, lang, token)
                .then(async translatedJson => {
                    if (isMerge) {
                        console.log(`合并文件 ${path.join(mergeDir, `${lang}`+'.json')}...`);
                        // 合并文件,先读取文件
                        const mergeJson =await  readJsonFile(path.join(mergeDir, `${lang}`+'.json'));
                      
                        // 合并文件
                        Object.assign(mergeJson, translatedJson);
                        // 写入翻译结果
                        translatedJson = mergeJson;
                    }
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
