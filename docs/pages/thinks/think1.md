### for (var i = 0; i < 10; i++) { 的所有解法


```
  // 1
  // 改造下面的代码，使之输出0-9，写出你能想到的所有解法
  for (var i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i)
    }, 0)
  }
  // 10个10
  // 之所以打印10个10 是由于setTimeout  和var 的问题造成的
  // var 块级作用域  setTimeout 宏任务 所以只有当for循环走完之后才会去执行setTimeout 但当for循环走完 var 已经是10 了

  // let
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i)
    }, 1000)
  }

  //采用闭包
  for (var i = 0; i < 10; i++) {
    function name(i) {
      return () => {
        setTimeout(() => {
          console.log(i)
        }, 1000)
      }
    }
    name(i)()
  }
  //采用立即执行函数
  for (var i = 0; i < 10; i++) {
    (function (i) {
      setTimeout(() => {
        console.log(i)
      }, 1000)
    })(i)
  }
```