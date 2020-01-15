import request from '@/utils/request'

/**
 * 模块列表
 * @param {int} pageNo 页数
 * @param {int} pageSize 页码
 * @param {int} search_name 搜索模块名
 * @param {int} search_key 搜索模块key
 */
export function moduleList(data) {
  return request({
    url: '/admin/lang/lang_module/index',
    method: 'post',
    data
  })
}

/**
 * 模块添加
 * @param {string} name 模块名称
 * @param {string} module_key 模块key
 */
export function moduleAdd(data) {
  return request({
    url: '/admin/lang/lang_module/add',
    method: 'post',
    data
  })
}

/**
 * 模块编辑
 * @param {string} name 模块名称
 * @param {string} module_key 模块key
 * @param {int} id ID
 */
export function moduleEdit(data) {
  return request({
    url: '/admin/lang/lang_module/edit',
    method: 'post',
    data
  })
}

/**
 * 模块删除
 * @param {int} id ID
 */
export function moduleDel(data) {
  return request({
    url: '/admin/lang/lang_module/del',
    method: 'post',
    data
  })
}

/**
 * 模块详情
 * @param {int} id ID
 */
export function moduleInfo(data) {
  return request({
    url: '/admin/lang/lang_module/getInfo',
    method: 'post',
    data
  })
}
