import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://laplacecode.github.io/',
  lang: 'zh-CN',
  title: 'Have fun every day!',
  subtitle: 'Laplace的个人博客',
  author: {
    name: 'Laplace',
    avatar: 'https://avatars.githubusercontent.com/u/58564836?v=4',//github avatar
  },
  description: '',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/laplacecode',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/6764897',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: false,
    title: '赞助我',
    methods: [
      {
        name: '支付宝',
        url: 'https://cdn.yunyoujun.cn/img/donate/alipay-qrcode.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: '微信支付',
        url: 'https://cdn.yunyoujun.cn/img/donate/wechatpay-qrcode.jpg',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
})
