import request from '@/utils/request'

/**
 * 按钮列表
 * @param {int} pageNo 页数
 * @param {int} pageSize 页码
 * @param {string} module_key 搜索模块key
 */
export function btnList(data) {
  return request({
    url: '/admin/lang/lang_button/modulebutton',
    method: 'post',
    data
  })
}

/**
 * 按钮添加
 * @param {string} name 按钮名称
 * @param {string} country_id 语言国家id
 * @param {string} module_key 模块key
 * @param {string} button_key 按钮key
 * @param {string} button_value 对应语言值
 */
export function btnAdd(data) {
  return request({
    url: '/admin/lang/lang_button/add',
    method: 'post',
    data
  })
}

/**
 * 按钮编辑
 * @param {string} name 模块名称
 * @param {string} country_id 语言国家id
 * @param {string} module_key 模块key
 * @param {string} button_key 按钮key
 * @param {string} button_value 对应语言值
 * @param {int} id ID
 */
export function btnEdit(data) {
  return request({
    url: '/admin/lang/lang_button/edit',
    method: 'post',
    data
  })
}

/**
 * 按钮删除
 * @param {int} id ID
 */
export function btnDel(data) {
  return request({
    url: '/admin/lang/lang_button/del',
    method: 'post',
    data
  })
}

/**
 * 按钮详情
 * @param {int} id ID
 */
export function btnInfo(data) {
  return request({
    url: '/admin/lang/lang_button/getInfo',
    method: 'post',
    data
  })
}

/**
 * 按钮语言列表
 * @param {int} pageNo 页数
 * @param {int} pageSize 页码
 * @param {string} module_key 模块key
 * @param {string} button_key 按钮key
 */
export function buttondetail(data) {
  return request({
    url: '/admin/lang/lang_button/buttondetail',
    method: 'post',
    data
  })
}