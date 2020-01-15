import request from '@/utils/request'

/**
 * 会员-详情-车辆列表
 * @param {int} pageNo 页码
 * @param {int} pageSize 分页大小
 * @param {int} main_mobile 邀请人手机
 * @param {int} new_mobile 被邀请人手机
 * @param {int} new_status 被邀请人状态 0未认证 1已认证 -1已暂停 -2已取消
 * @param {int} ctime 提交时间 2019-01-01/2019-02-01
 */
export function getList(data) {
  return request({
    url: '/admin/member/member/invitelog',
    method: 'post',
    data
  })
}
