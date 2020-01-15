import request from '@/utils/request'

/**
 * 设置用户协议和关于我们信息
 */
export function setup(data) {
  return request({
    url: '/admin/set/help/save',
    method: 'post',
    data
  })
}

/**
 * 获取基础配置信息
 *
 */
export function getMsg(data) {
  return request({
    url: '/admin/set/help/index',
    method: 'post',
    data
  })
}

/**
 * 新会员金额相关设置获取
 *
 */
export function getParms(data) {
  return request({
    url: '/admin/set/help/getParms',
    method: 'post',
    data
  })

}
/**
 * 新会员金额相关设置
 *
 */
export function setParms(data) {
  return request({
    url: '/admin/set/help/setParms',
    method: 'post',
    data
  })
}
/**
 * 常见问题列表
 *
 */
export function getlist(data) {
  return request({
    url: '/admin/set/help/index',
    method: 'post',
    data
  })
}
/**
 * 常见问题添加
 *
 */
export function infoAdd(data) {
  return request({
    url: '/admin/set/help/add',
    method: 'post',
    data
  })
}
/**
 * 常见问题详情
 *
 */
export function infoShow(data) {
  return request({
    url: '/admin/set/help/detail',
    method: 'post',
    data
  })
}
/**
 * 常见问题编辑
 *
 */
export function infoEdit(data) {
  return request({
    url: '/admin/set/help/save',
    method: 'post',
    data
  })
}
/**
 * 常见问题删除
 *
 */
export function infoDelete(data) {
  return request({
    url: '/admin/set/help/delete',
    method: 'post',
    data
  })
}
/**
 * 账户详情
 *
 */
export function accountDetail(data) {
  return request({
    url: '/admin/sys/admin/detail',
    method: 'post',
    data
  })
}
/**
 * 账户设置
 *
 */
export function setAccount(data) {
  return request({
    url: '/admin/sys/admin/edit_pass',
    method: 'post',
    data
  })
}
/**
 * 版本详情
 *
 */
export function versionDetail(data) {
  return request({
    url: '/admin/set/version/detail',
    method: 'post',
    data
  })
}

/**
 * 版本详情
 *
 */
export function versionEdit(data) {
  return request({
    url: '/admin/set/version/edit',
    method: 'post',
    data
  })
}


