import request from '@/utils/request'

/**
 * 会员组列表
 * @param {int} member_id 钱包账户ID-MID
 * @param {int} mobile 用户手机号
 * @param {int} pay_type 支付方式
 * @param {int} money_type 押金类型(4 交押金，6退押金)
 * @param {int} pageNo 当前页数
 * @param {int} pageSize 当前页记录数
 */
export function getList(data) {
  return request({
    url: '/admin/member/member/getDepositIndex',
    method: 'post',
    data
  })
}
/**
 * 会员组列表
 * @param {int} mid 用户MID
 */
export function reDeposit(data) {
  return request({
    url: '/admin/member/member/refundDeposit',
    method: 'post',
    data
  })
}
