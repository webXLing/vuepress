<!--
 * @Author: web_XL
 * @Date: 2020-09-02 15:06:45
 * @LastEditors: web_XL
 * @LastEditTime: 2020-09-02 15:42:34
 * @Description: 
-->
### 实现一个异步任务的同步 队列

```
// 异步函数a
var a = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
    console.log('a',Date.now());
    resolve('a')
    }, 1000)
  })
}
  
// 异步函数b
var b = function (data) {
return new Promise(function (resolve, reject) {
console.log('b',Date.now());
  resolve(data + 'b')
})
}
  
// 异步函数c
var c = function (data) {
return new Promise(function (resolve, reject) {
  setTimeout(function () {
  console.log('c',Date.now());
  resolve(data + 'c')
  }, 500)
})
}


async function queue(arr){
  let res = null
  for (const promisify of arr) {
    res = await promisify()
  }
  return await res
}


// Promise.resolve().then(a).then(b).then(c)
function queue(arr){
  let promise = Promise.resolve()
  arr.forEach((item)=>{
    promise = promise.then(item)
  })
}

queue(arr)
  .then(()=>{
    console.log("finished")
  })


```