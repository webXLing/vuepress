<!--
 * @Author: web_XL
 * @Date: 2020-08-19 14:39:21
 * @LastEditors: web_XL
 * @LastEditTime: 2020-08-19 14:41:10
 * @Description: 
-->
### 观察者模式 和发布订阅模式
>  观察者模式 由于观察者 自身有都有一个相同的方法update 去接受发布的消息 就像java中的interface 一样 这些观察者都是在一个基类下的 所以这样发布者就通过update去发布消息 这样 发布者和观察者耦合性更强一些 并且 不能注册不同的事件

>  发布订阅模式 可以注册不同的事件 通知不同的观察者 发布订阅模式是强化版的观察者模式

```
  function Observer() {
    this.update = function () { }
  }

  // 定一个下目标
  function Subscribe() {
    this.observers = []
  }

  // 添加观察者
  Subscribe.prototype.addObserver = function (observer) {
    this.observers.push(observer)
  }

  // 目标通知变更
  Subscribe.prototype.notify = function (message) {
    for (var i = this.observers.length - 1; i >= 0; i--) {
      this.observers[i].update(message)
    };
  }

  var subscribe = new Subscribe();

  // 定义一个佩奇猪的观察者
  var peikizhuObs = new Observer();
  peikizhuObs.update = function (what) {
    console.log("12 o'clock! 佩奇猪想要" + what);
  }
  subscribe.addObserver(peikizhuObs);

  // 定义一个皮卡丘的观察者
  var pikachuObs = new Observer();
  pikachuObs.update = function (what) {
    // console.log("皮卡丘还可以做一点自己比较个性的事情，但是12点我也是要去吃饭的！");
    console.log("12 o'clock! 皮卡丘想要" + what);
  }
  subscribe.addObserver(pikachuObs);

  // 假装12点到了
  subscribe.notify('去吃饭啦～');  // 它们都去吃饭了

  // or
  subscribe.notify('继续玩耍～');  // 它们还在一起玩耍

  // 说明：可以看出，每一个observer虽然也可以自定义自己的处理程序（update方法），但是观察者模式下，观察者们都是做同一类的事情的。


  // 发布-订阅模式 ----
  // 简易的发布订阅
  var pubsub = {
    tasks: {},
    subscribe: function (taskName, fn) {
      if (this.tasks[taskName]) {
        this.tasks[taskName].push(fn)
      } else {
        this.tasks[taskName] = [fn]
      }
    },

    publish: function (taskName, msg) {
      this.tasks[taskName].forEach(item => {
        item(msg)
      })
    }
  }

  // 佩奇猪：我要订阅一个「12点」的主题事件，提醒我继续工作
  pubsub.subscribe("12 o'clock", function () {
    console.log('佩奇猪要继续工作！这就是为什么本猪上了屏幕，而你们上了餐桌。')
  });

  // 皮卡丘：我也要订阅一个「12点」的主题事件，提醒我去吃饭
  pubsub.subscribe("12 o'clock", function () {
    console.log('皮卡丘要吃饭，去它的工作！')
  });

  // 假装12点到了
  pubsub.publish("12 o'clock");

```