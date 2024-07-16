# i18n-translator
> 此项目基于ChatGPT进行辅助编写，自己简单修改了以下即可实现所有功能，聊天记录: [https://chatgpt.com/share/5c51d880-12eb-4576-9f43-84ad988bd872](https://chatgpt.com/share/5c51d880-12eb-4576-9f43-84ad988bd872)

该项目旨在读取指定的 JSON 文件，创建其副本，并使用 Microsoft 翻译 API 将其内容翻译成多种语言。翻译结果保存在与原始文件结构相同的新 JSON 文件中。
* 微软翻译接入的是免申请的API，无需任何配置，直接使用即可

## 功能

1. 读取指定的 JSON 文件并创建其翻译文件。
2. 根据语言列表创建多个翻译任务。
3. 每个任务独立执行。 
4. 每次执行从 Microsoft 翻译认证 API 获取新的 Token。
5. 使用 Microsoft 翻译 API 递归翻译 JSON 值。
6. 将翻译后的 JSON 文件保存到新目录中，文件结构和扩展名与原始文件相同，<span style='color:red'>如文件已存在则会覆盖文件</span>。
7. 自动去除json文件里的重复的key，所以翻译出来的文件行数可能与输入文件的行数不一致
 
## 安装

1. 克隆仓库：
    ```bash
    git clone https://github.com/geek-bigniu/i18n-translater.git
    cd i18n-translater
    ```

2. 安装依赖：
    ```bash
    npm install
    ```
3. 运行程序：
    ```bash
    npm run start
    ```

## 使用
 
1. 在 `index.js` 中设置目标语言，输入文件路径和输出目录：
    ```javascript
    // 目标语言列表
    const langs = ['en', 'ja'];
    // 输入文件路径
    const inputFilePath = 'locales/zh.json';
    // 输出文件夹
    const outputDir = 'locales';
    ```

3. 运行程序：
    ```bash
    npm run start
    ```
    或
    ```bash
    node index.js
    ```

## 代码结构
- `locales`: 语言文件存放目录
- `tokenManager.js`：负责管理 Token 的获取和缓存。
- `fileManager.js`：负责读取和写入 JSON 文件。
- `translator.js`：负责调用翻译 API 并处理翻译结果。
- `axiosInstance.js`：封装 Axios 实例，统一处理请求头。
- `index.js`：主程序，协调各个模块，执行翻译任务。

## 示例

假设有一个输入文件 `locales/zh.json`，内容如下：
```json
{
    "hello": "你好",
    "world": "世界",
    "hello.world": "你好，世界",
    "object": {
        "objectKey": "对象测试",
        "object1": {
            "object1Key": "对象1测试"
        }
    },
    "中文": "中文",
    "重复值":"重复值",
    "重复值":"重复值"
}
```
在 `index.js` 中设置目标语言，输入文件路径和输出目录：
```javascript
...
// 目标语言列表
const langs = ['en', 'ja'];
// 输入文件路径
const inputFilePath = 'locales/zh.json';
// 输出文件夹
const outputDir = 'locales';
...
```
则会在`locales`目录下生成`en.json`和`ja.json`文件

en.json
```json
{
  "hello": "Hello",
  "world": "world",
  "hello.world": "Hello, world",
  "object": {
    "objectKey": "Object Testing",
    "object1": {
      "object1Key": "Subject 1 test"
    }
  },
  "中文": "Chinese",
  "重复值": "Duplicate values"
}
```

ja.json
```json
{
  "hello": "こんにちは",
  "world": "世界",
  "hello.world": "ハローワールド",
  "object": {
    "objectKey": "オブジェクトテスト",
    "object1": {
      "object1Key": "被験者1の試験"
    }
  },
  "中文": "中国語",
  "重复值": "重複する値"
}
```