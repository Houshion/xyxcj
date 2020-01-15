import request from '@/utils/request'

/**
 * 会员组列表
 */
export function getList() {
  return request({
    url: '/admin/member/group/getGroupIndex',
    method: 'post',
  })
}

/**
 * 会员组-新增/编辑
 * @param {int} id 用户组id(新增时，输入0值)
 * @param {int} name 用户组名称
 * @param {int} memo 备注
 */
export function editGroup(data) {
  return request({
    url: '/admin/member/group/editGroup',
    method: 'post',
    data
  })
}
/**
 * 会员-认证
 * @param {int} id 用户组ID
 */
export function delGroup(data) {
  return request({
    url: '/admin/member/group/delGroup',
    method: 'post',
    data
  })
}
