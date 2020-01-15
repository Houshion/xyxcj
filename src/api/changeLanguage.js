import request from '@/utils/request'

/**
 * 获取语言
 */
export function getLang() {
  return request({
    url: '/admin/lang/lang_country/getLang',
    method: 'get',
  })
}

/**
 * 设置语言
 * @param {string} keyname 语言标识
 */
export function setLang(data) {
  return request({
    url: '/admin/lang/lang_country/setLang',
    method: 'post',
    data
  })
}

/**
 * 获取语言路径
 */
export function getLangUrl() {
  return request({
    url: '/admin/lang/lang_country/getLangUrl',
    method: 'get',
  })
}
