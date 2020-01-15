import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/sys/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/sys/auth/userInfo',
    method: 'post',
    params: {
      token
    }
  })
}

export function getMenu() {
  return request({
    url: '/admin/sys/auth/menu',
    method: 'post'
  })
}

/**
 * 用户反馈列表
 */
export function feedbackIndex(data) {
  return request({
    url: '/admin/feedback/feedback/index',
    method: 'post',
    data
  })
}
/**
 * 用户反馈删除
 */
export function feedbackDel(data) {
  return request({
    url: '/admin/feedback/feedback/delete',
    method: 'post',
    data
  })
}
/**
 * 用户反馈回复
 */
export function feedbackSave(data) {
  return request({
    url: '/admin/feedback/feedback/save',
    method: 'post',
    data
  })
}
/**
 * 用户反馈回复编辑
 */
export function feedbackReply(data) {
  return request({
    url: '/admin/feedback/feedback/editReply',
    method: 'post',
    data
  })
}
/**
 * 获取用户反馈内容
 */
export function feedbackGetReply(data) {
  return request({
    url: '/admin/feedback/feedback/getReply',
    method: 'post',
    data
  })
}
/**
 * 添加会员
 */
export function memberAdd(data) {
  return request({
    url: '/admin/member/member/add',
    method: 'post',
    data
  })
}
/**
 * 修改会员/密码/状态
 */
export function memberEdit(data) {
  return request({
    url: '/admin/member/member/edit',
    method: 'post',
    data
  })
}
