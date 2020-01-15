import request from '@/utils/request'

/**
 * 用户列表
 * @param {int} pageNo 页码
 * @param {int} pageSize 分页大小
 * @param {string} namekey 搜索昵称
 * @param {string} telkey 搜索手机
 */
export function getUserList(data) {
  return request({
    url: '/admin/user/member/getUserList',
    method: 'post',
    data
  })
}
/**
 * 管理员列表
 * @param {int} pageNo 页码
 * @param {int} pageSize 分页大小
 * @param {string} keyword 搜索账号/昵称/手机/邮箱
 */
export function memberList(data) {
  return request({
    url: '/admin/sys/admin/index',
    method: 'post',
    data
  })
}

/**
 * 管理员详情
 * @param {int} mid 管理员ID
 */
export function memberDetail(data) {
  return request({
    url: '/admin/sys/admin/show',
    method: 'post',
    data
  })
}
// 添加管理员
export function memberAdd(data) {
  return request({
    url: '/admin/sys/admin/add',
    method: 'post',
    data
  })
}
// 编辑管理员
export function memberEdit(data) {
  return request({
    url: '/admin/sys/admin/edit',
    method: 'post',
    data
  })
}

/**
 * 删除管理员
 * @param {int} mid 管理员ID
 */
export function memberDel(data) {
  return request({
    url: '/admin/sys/admin/delete',
    method: 'post',
    data
  })
}
