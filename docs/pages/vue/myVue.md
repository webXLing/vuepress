### 手写一个vue

#### html
```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>MVVM</title>
</head>
<!-- MVVM 双向数据绑定 angular 脏值检测 vue 数据劫持+发布订阅者模式 -->
<!-- vue 不支持ie8以下 =>Object.defineProperty -->
<script src="./myVue.js"></script>

<body>
  <div id='app'>
    <p>a:{{a.a}}</p>
    <p>b:{{b}}</p>
    <input type="text" v-model='b'>
    <div>{{foo}}</div>
  </div>
</body>
<script>
  let vm = new Myvue({
    el: '#app',
    data: {
      a: {
        a: 1
      },
      b: 'nihao',
      c: '今天是524'
    },
    computed: {
      // foo() {
      //   return this.b + this.c
      // }
      foo: {
        get() {
          return this.b + this.c
        }
      }
    }
  })






</script>

</html>
```

#### myVue
```
/*
 * @Author: web_XL 
 * @Date: 2019-05-22 21:03:35 
 * @Last Modified by: web_XL
 * @Last Modified time: 2019-05-25 08:59:06
 */

function Myvue (options = {}) {
  this.$options = options //将所有属性挂在到$options
  let data = this._data = this.$options.data
  observe(data);//劫持对象  给对象通过Object.defineProperty 设置setter getter

  // 数据代理  this代理this._data
  for (let key in data) {//this.a 或者 this.a=2 其实都是在操作this._data
    Object.defineProperty(this, key, {
      enumerable: true,
      set (newVal) {
        this._data[key] = newVal
      },
      get () {
        return this._data[key]
      }
    })
  }
  //这里用call 和 apply 没区别 函数被直接执行 都是让initComputed方法中的this指向 构造函数Myvue 所new出来的实例
  // 若要使用bind 要采取一下的写法
  // const Computed = initComputed.bind(this)
  // Computed()
  initComputed.call(this)
  new Compile(this.$options.el, this)
}


function initComputed () {
  console.log('this', this)
  let vm = this
  let computed = this.$options.computed

  Object.keys(computed).forEach(key => {
    Object.defineProperty(vm, key, {
      //函数写法 或者对象 get set 写法
      get: typeof computed[key] === 'function' ? computed[key] : computed[key].get
    })
  })
}

// 编译模板
function Compile (el, vm) {
  // el 替换的范围
  vm.$el = document.querySelector(el)
  console.log(el)
  // 创建文档碎片 将根节点转移至文档碎片(内存)
  let fragment = document.createDocumentFragment();
  // 因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。
  let firstChild
  while (firstChild = vm.$el.firstChild) {
    //将现有的DOM插入fragment时  会在原来的DOM上删除   所以执行到这一步会发现页面中$el内没了 子元素
    fragment.appendChild(firstChild)
  }
  let reg = /\{\{(.*)\}\}/ //匹配 {{xxx}}  '.'=>除换行符(\n)以外的任意字符
  replace(fragment)
  function replace (node) {
    Array.from(node.childNodes).forEach(node => {
      // console.log('node', node, node.nodeType, node.childNodes)
      let text = node.textContent //将初始的文本内容保留下来 {{a.a}}  {{b}}
      if (node.nodeType == 3 && reg.test(text)) {
        console.log('就是你', RegExp.$1)//RegExp.$1 => 正则中的第一个括号内的 内容  a.a b
        let arr = RegExp.$1.split('.') // [a,a] [b]
        let val = vm;
        //这样就找到了vm中的值 vm.a.a = 1  vm.b = 'nihao
        arr.forEach(item => {
          val = val[item]
        })

        // 将替换的逻辑订阅一下
        new Watcher(vm, RegExp.$1, function (newVal) {//回调函数需要一个新值
          // 将 对应节点中的进行替换 {{a.a}} => 1  {{b}}=> 'nihao'
          // node.textContent = node.textContent.replace(reg, val)
          node.textContent = text.replace(reg, newVal)
        })

        // 将 对应节点中的进行替换 {{a.a}} => 1  {{b}}=> 'nihao'
        node.textContent = text.replace(reg, val)

      }
      // 元素节点：1, 属性节点：2, 文本节点(文字、空格、换行) ：3, 注释节点：8
      if (node.nodeType == 1) {
        console.log(node, node.attributes)
        Array.from(node.attributes).forEach((item) => { // v-model='b'
          let name = item.name
          let exp = item.value
          // let exp1 = item.value.split('.')
          // let finalVal = vm
          // exp1.forEach((key) => {
          //   finalVal = finalVal[key]
          // })
          if (name == 'v-model') {
            node.value = vm[exp]
            // node.value = finalVal

            new Watcher(vm, item.value, function (newVal) {
              node.value = newVal
            })
            node.addEventListener('input', (e) => {
              let newVal = e.target.value
              vm[exp] = newVal
            }, false)
          }
          // console.log(item, item.name, item.value)
        })
      }
      if (node.childNodes.length) {//如果有子节点 
        replace(node)
      }
    })
  }

  vm.$el.appendChild(fragment)
}

// 发布订阅者模式
function Dep () {
  this.subs = []
}
Dep.prototype.addSub = function (sub) {//订阅事件
  this.subs.push(sub)
}
Dep.prototype.notify = function () {// 发布事件
  console.log(1)
  this.subs.forEach(sub => sub.updata())
}

// 观察者类
function Watcher (vm, exp, fn) {
  this.fn = fn
  this.vm = vm
  this.exp = exp
  //添加到订阅中
  Dep.target = this
  let val = vm
  exp.split('.').forEach(k => {//this.a.a  会调用getter
    val = val[k]
  })
  Dep.target = null

}
Watcher.prototype.updata = function () {
  let exp = this.exp
  let vm = this.vm
  let val = vm
  // 一notify 值已经更改了
  exp.split('.').forEach(k => {//this.a.a  会调用getter
    val = val[k]
  })
  this.fn(val)
}



// 数据劫持
function observe (data) {
  //由于字符串是可以枚举的 避免死循环
  if (!data || typeof data !== 'object') return
  return new Observe(data);
}
function Observe (data) {
  let dep = new Dep()
  for (let key in data) {
    let val = data[key]
    observe(val)//劫持它的子属性  也加上set get
    Object.defineProperty(data, key, {
      enumerable: true,//可以枚举
      set (newVal) {
        if (newVal === val) return //新值与旧值相同 直接return
        val = newVal
        observe(newVal)//劫持新值  给新值也加上set get
        // 设置完属性后更新视图  让所有的wacher的updata方法执行
        dep.notify()
      },
      get () {
        Dep.target && dep.addSub(Dep.target)//订阅wacher实例  [wacher]
        return val
      }
    })
  }
}
// 所以vue 为什么不能新增不存在的属性 不存在的属性就没有set get
// 深度响应原理 每赋值一个新的对象就会劫持这个对象 给这个对象加上setter getter






// --------
// [].slice.call(childNodes) 将一个伪数组转为一个数组 和 Array.from 是一个作用
// Compile.js 文件
// class Compile {
//   constructor(el, vm) {
//     console.log(el, vm)
//     this.el = this.isElementNode(el) ? el : document.querySelector(el);
//     // this.el = document.querySelector(el);
//     this.vm = vm;

//     // 如过传入的根元素存在，才开始编译
//     if (this.el) {
//       // 1、把这些真实的 Dom 移动到内存中，即 fragment（文档碎片）
//       let fragment = this.node2fragment(this.el);

//       // 2、将模板中的指令中的变量和 {{}} 中的变量替换成真实的数据
//       this.compile(fragment);

//       // 3、把编译好的 fragment 再塞回页面中
//       // this.el.appendChild(fragment);

//     }
//   }

//   /* 辅助方法 */
//   // 判断是否是元素节点
//   isElementNode (node) {
//     console.log('node', node)
//     return node.nodeType === 1;
//   }
//   // 判断属性是否为指令
//   isDirective (name) {
//     return name.includes("v-");
//   }

//   /* 核心方法 */
//   // 将根节点转移至文档碎片
//   node2fragment (el) {
//     // 创建文档碎片
//     // 因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。
//     let fragment = document.createDocumentFragment();
//     // 第一个子节点
//     let firstChild;

//     // 循环取出根节点中的节点并放入文档碎片中
//     while (firstChild = el.firstChild) {// 直到el中没有了子节点
//       console.log('el.firstChild', el.firstChild)
//       //将现有的DOM插入fragment时  会在原来的DOM上删除   所以执行到这一步会发现页面中$el内没了 子元素
//       fragment.appendChild(firstChild);
//     }
//     return fragment;
//   }

//   // 解析文档碎片
//   compile (fragment) {
//     // 当前父节点节点的子节点，包含文本节点，类数组对象
//     let childNodes = fragment.childNodes;
//     // nodeType 元素节点：1 ,属性节点：2 ,文本节点(文字、空格、换行)：3 ,注释节点：8
//     // 转换成数组并循环判断每一个节点的类型
//     // Array.from() 可以将类数组或者可以迭代对象转成为数组 console.log(Array.from([1, 2, 3], x => x + x));
//     Array.from(childNodes).forEach(node => {
//       if (this.isElementNode(node)) { // 是元素节点
//         // 递归编译子节点
//         this.compile(node);

//         // 编译元素节点的方法
//         this.compileElement(node);
//       } else { // 是文本节点
//         // 编译文本节点的方法
//         this.compileText(node);
//       }
//     });
//   }
//   // 编译元素
//   compileElement (node) {
//     // return
//     // 取出当前节点的属性，类数组
//     let attrs = node.attributes;
//     // return
//     Array.from(attrs).forEach(attr => {
//       console.log('attr', attr, attr.name, attr.value)
//       // return
//       // 获取属性名，判断属性是否为指令，即含 v-
//       let attrName = attr.name;

//       if (this.isDirective(attrName)) {
//         // 如果是指令，取到该属性值得变量在 data 中对应得值，替换到节点中
//         let exp = attr.value;

//         // 取出方法名
//         let [, type] = attrName.split("-");

//         // 调用指令对应得方法
//         CompileUtil[type](node, this.vm, exp);
//       }
//     });
//   }
//   // 编译文本
//   compileText (node) {
//     // return
//     // 获取文本节点的内容
//     let exp = node.contentText;
//     // console.log('exp', exp)
//     // return
//     // 创建匹配 {{}} 的正则表达式
//     let reg = /\{\{([^}+])\}\}/g;

//     // 如果存在 {{}} 则使用 text 指令的方法
//     if (reg.test(exp)) {
//       console.log('含有{{}}', exp)
//       return
//       CompileUtil["text"](node, this.vm, exp);
//     }
//   }

// }


```