import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import elementZwLocale from 'element-ui/lib/locale/lang/zh-TW' // element-ui lang

import enLocalel from './en-l' // 后台正式添加后，注释该段
import zhLocalel from './zh-l' // 后台正式添加后，注释该段
import zwLocalel from './zk-l' // 后台正式添加后，注释该段

// console.log('enus', enus)
// console.log('zhcn', zhcn)
console.log('zhhk', zwLocalel)

Vue.use(VueI18n)

const messages = {
  'en-us': {
    ...enus,
    // ...enLocale,
    ...enLocalel,
    ...elementEnLocale,
  },
  'zh-cn': {
    ...zhcn,
    // ...zhLocale,
    ...zhLocalel,
    ...elementZhLocale
  },
  'zh-hk': {
    ...zhhk,
    // ...zwLocale,
    ...zwLocalel,
    ...elementZwLocale
  },
}
// console.log('messages', messages)
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  // const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  // const locales = Object.keys(messages)
  // for (const locale of locales) {
  //   if (language.indexOf(locale) > -1) {
  //     return locale
  //   }
  // }
  return 'zh-hk'
}


const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n
