import request from '@/utils/request'

/**
 * 登录日志
 * @param {String} pageNo 页码
 * @param {String} pageSize 条数
 */
export function login_log(data) {
  return request({
    url: '/admin/sys/Edit_log/login_log',
    method: 'post',
    data
  })
}

/**
 * 编辑会员日志
 * @param {String} pageNo 页码
 * @param {String} pageSize 条数
 * @param {String} username 操作人（搜索条件）
 * @param {String} mobile 会员手机号（搜索条件）
 * @param {String} play_time 操作日期（搜索条件）
 */
export function user_log(data) {
  return request({
    url: '/admin/sys/Edit_log/user_log',
    method: 'post',
    data
  })
}

/**
 * 编辑会员日志
 * @param {String} pageNo 页码
 * @param {String} pageSize 条数
 * @param {String} username 操作人（搜索条件）
 * @param {String} mobile 会员手机号（搜索条件）
 * @param {String} play_time 操作日期（搜索条件）
 * @param {String} memo 订单编号（搜索条件）
 */
export function order_log(data) {
  return request({
    url: '/admin/sys/Edit_log/order_log',
    method: 'post',
    data
  })
}