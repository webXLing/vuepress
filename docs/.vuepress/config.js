/*
 * @Author: web_XL
 * @Date: 2019-11-26 14:31:30
 * @LastEditors: web_XL
 * @LastEditTime: 2020-09-03 14:31:31
 * @Description: 
 */
module.exports = {
  title: 'Love Life首页', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: 'Love Life的前端记录', // meta 中的描述文字，用于SEO
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', { rel: 'icon', href: '/egg.png' }],  //浏览器的标签栏的网页图标
  ],
  markdown: {
    lineNumbers: true
  },
  serviceWorker: true,
  themeConfig: {
    logo: '/egg.png',
    lastUpdated: 'lastUpdate', // string | boolean
    nav: [
      { text: '首页', link: '/' },
      {
        text: '分类',
        ariaLabel: '分类',
        items: [
          { text: '文章', link: '/pages/folder1/p_19_11_25.md' },
          { text: '琐碎1', link: '/pages/folder2/test4.md' },
        ]
      },
      { text: '功能演示', link: '/pages/folder1/p_19_11_25.md' },
      { text: 'Github', link: 'https://github.com/dwanda' },
    ],
    sidebar: {
      '/pages/folder1/': [
        {
          title: '记录',   // 必要的
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1,    // 可选的, 默认值是 1
          children: [
            ['p_19_11_25.md', 'js运算精度解决'],
            ['p_19_11_26.md', '路由页面滚动重置'],
            ['p_19_11_27.md', '实现手机号输入-自动分割'],
            ['p_19_11_28.md', '移动端line-height失效'],
            ['p_19_11_29.md', 'Mybatis'],
            ['p_19_12_03.md', '!+ '],
            ['p_19_12_26.md', 'webpack'],
            ['p_20_03_05.md', '事件循环']
          ]
        },
        // {
        //   title: '测试菜单2',
        //   collapsable: false, // 可选的, 默认值是 true,
        //   children: [
        //     ['test2.md', '子菜单1']
        //   ]
        // }
      ],

      '/pages/folder2/': [
        {
          title: '记录1',   // 必要的
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1,    // 可选的, 默认值是 1
          children: [
            ['test4.md', 'js运算精度解决'],
            ['test5.md', '路由页面滚动重置'],
            ['log-09-03.md', 'export与export default的区别']
          ]
        },
      ]
    }
  }
}