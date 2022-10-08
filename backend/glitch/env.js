/*
    title : glitch.com Environment Variables
    file  : .env
    desc  : The .env file is for storing secrets for your app, like an API key. 
            Any project member can see the contents in the same way that you can, 
            and everyone else can just see the variable names.
    link  : https://glitch.happyfox.com/kb/section/25/

    sample code :
    
    ```js
    const env = {
        test_key : '123456'
    }

    module.exports = env
    ```

    usage : process.env.test_key
*/

//
// 禁止修改本文件的内容
//
// 在glitch环境下，使用../.env文件配置相关密钥
// 在非glitch环境下，使用./env文件配置相关密钥
//
module.exports = undefined