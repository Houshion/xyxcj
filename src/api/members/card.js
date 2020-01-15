import request from '@/utils/request'

/**
 * 会员卡列表
 * @param {int} mobile 用户手机号
 * @param {int} number 用户卡号
 * @param {int} pageNo 当前页数
 * @param {int} pageSize 当前页记录数
 */
export function getList(data) {
  return request({
    url: '/admin/member/card/getCardIndex',
    method: 'post',
    data
  })
}

/**
 * 会员卡-获取信息
 * @param {int} id 会员卡流水号id
 */
export function getInfo(data) {
  return request({
    url: '/admin/member/card/getCardInfo',
    method: 'post',
    data
  })
}

/**
 * 会员卡-变更状态
 * @param {int} id 会员卡流水号id
 * @param {string} msg 原因
 * @param {int} status 状态（0暂停 1激活 100 解绑 200 绑定）
 * @param {int} mid 用户mid
 */
export function changeStatus(data) {
  return request({
    url: '/admin/member/card/editCardStatus',
    method: 'post',
    data
  })
}

/**
 * 会员卡-编辑/新增
 * @param {int} id 会员卡id ,新增时输入0
 * @param {int} number 卡号
 * @param {string} memo 卡号说明
 * @param {int} face_number 卡面号
 * @param {int} mid 要绑定的用户mid
 */
export function editCard(data) {
  return request({
    url: '/admin/member/card/editCard',
    method: 'post',
    data
  })
}

/**
 * 根据手机号获取会员呢称
 * @param {int} mobile 用户手机号
 */
export function getMobileToName(data) {
  return request({
    url: '/admin/member/card/getMobileToName',
    method: 'post',
    data
  })
}
