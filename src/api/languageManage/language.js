import request from '@/utils/request'

/**
 * 语言国家列表
 * @param {int} pageNo 页数
 * @param {int} pageSize 页码
 */
export function langList(data) {
  return request({
    url: '/admin/lang/lang_country/index',
    method: 'post',
    data
  })
}

/**
 * 语言国家添加
 * @param {string} name 语言名称
 * @param {string} language 对应语言
 * @param {string} img_url 图片
 * @param {string} version 版本
 * @param {string} keyname keyname
 */
export function langAdd(data) {
  return request({
    url: '/admin/lang/lang_country/add',
    method: 'post',
    data
  })
}

/**
 * 语言国家编辑
 * @param {string} name 语言名称
 * @param {string} language 对应语言
 * @param {string} img_url 图片
 * @param {string} version 版本
 * @param {string} keyname keyname
 * @param {int} ID ID
 */
export function langEdit(data) {
  return request({
    url: '/admin/lang/lang_country/edit',
    method: 'post',
    data
  })
}

/**
 * 语言国家删除
 * @param {int} id ID
 */
export function langDel(data) {
  return request({
    url: '/admin/lang/lang_country/del',
    method: 'post',
    data
  })
}

/**
 * 语言国家详情
 * @param {int} id ID
 */
export function langInfo(data) {
  return request({
    url: '/admin/lang/lang_country/getInfo',
    method: 'post',
    data
  })
}