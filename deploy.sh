###
 # @Author: web_XL
 # @Date: 2019-11-23 14:00:21
 # @LastEditors: web_XL
 # @LastEditTime: 2020-08-19 11:26:50
 # @Description: 
### 
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:webXLing/webXLing.github.io.git master

cd -