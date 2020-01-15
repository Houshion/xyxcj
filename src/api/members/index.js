import request from '@/utils/request'

/**
 * 会员列表
 * @param {int} mid 用户MID
 * @param {int} nickname 用户呢称
 * @param {int} mobile 用户手机号
 * @param {int} number 卡号
 * @param {int} pageNo 当前页数
 * @param {int} pageSize 当前页记录数
 * @param {int} status 状态（0未认证 1已认证 -1已暂停 -2已取消）,空值是查找全部
 * @param {int} group_id 用户组id，可以多个，形式如 1,3,5
 */
export function getList(data) {
  return request({
    url: '/admin/member/member/getMemberIndex',
    method: 'post',
    data
  })
}

/**
 * 会员-认证
 * @param {int} mid 用户MID
 * @param {string} face_number 卡面号
 * @param {string} memo 卡号说明
 * @param {string} number 卡号
 * @param {string} group_id 会员组别，多个组别时，形式如：2，3
 * @param {int} payment_typeid 支付类型id(余额支付 1 现金支付 2 会员卡 3支付宝 11 银行卡 13)
 * @param {string} deposit_code 备查号
 */
export function memberAuth(data) {
  return request({
    url: '/admin/member/member/MemberAuth',
    method: 'post',
    data
  })
}
/**
 * 会员-详情-基本信息
 * @param {int} mid 用户MID
 */
export function memberInfo(data) {
  return request({
    url: '/admin/member/member/getMemberInfo',
    method: 'post',
    data
  })
}
/**
 * 会员-详情-车辆列表
 * @param {int} mid 用户MID
 */
export function carList(data) {
  return request({
    url: '/admin/member/member/getCarList',
    method: 'post',
    data
  })
}
/**
 * 会员-详情-会员卡列表
 * @param {int} mid 用户MID
 */
export function cardList(data) {
  return request({
    url: '/admin/member/member/getCardList',
    method: 'post',
    data
  })
}
/**
 * 会员-详情-充值列表
 * @param {int} mid 用户MID
 */
export function rechargeList(data) {
  return request({
    url: '/admin/member/member/getRechargeList',
    method: 'post',
    data
  })
}
/**
 * 会员-详情-消费数据列表
 * @param {int} mid 用户MID
 */
export function orderList(data) {
  return request({
    url: '/admin/member/member/getUsedOrderList',
    method: 'post',
    data
  })
}
/**
 * 香港地区
 */
export function getArea() {
  return request({
    url: '/api/Public/getHtmlArea',
    method: 'get',
  })
}
/**
 * 会员充值
 * @param {int} mid 会员ID
 * @param {int} taocanid 套餐ID
 * @param {int} payment_typeid 支付方式
 * @param {int} payment_number 备查号
 */
export function recharge(data) {
  return request({
    url: '/admin/order/order/recharge_add',
    method: 'post',
    data
  })
}

/**
 * 会员-修改基本信息
 * @param {int} mid 用户MID
 * @param {string} group_id 用户组id,可多个id，形式如 1,2,5
 * @param {int} city 市id
 * @param {int} area 区id
 * @param {int} status 状态（0未认证 1已认证 -1已暂停 -2已取消）
 */
export function editMemberStatus(data) {
  return request({
    url: '/admin/member/member/editMemberStatus',
    method: 'post',
    data
  })
}


/**
 * 1.3 会员卡-变更状态
 *id	T文本	是	用户流水号id
msg	T文本	是处理原因
status	T文本	是	状态（0暂停 1激活 100 解绑 200 绑定）
mid	T文本	是
用户mid
 */
export function editCardStatus(data) {
  return request({
    url: '/admin/member/card/editCardStatus',
    method: 'post',
    data
  })
}

/**
 * 会员-再次交押金
 *mid	T文本	是要绑定的用户mid

 payment_typeid	T文本	是支付类型id(余额支付 1 现金支付 2 会员卡 3支付宝 11 银行卡 13)

 deposit_code	T文本	是备查号
 */
export function againUpDeposit(data) {
  return request({
    url: '/admin/member/member/againUpDeposit',
    method: 'post',
    data
  })
}
