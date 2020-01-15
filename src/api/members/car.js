import request from '@/utils/request'

/**
 * 会员-详情-车辆列表
 * @param {int} pageNo 页码
 * @param {int} pageSize 分页大小
 * @param {int} nickname 用户呢称
 * @param {int} mobile 用户手机号
 * @param {int} cartype 汽车类型( 1轻型客车/2私家车/3计程车)
 * @param {int} brand 汽车品牌
 * @param {int} stime 开始日期
 * @param {int} etime 结束日期
 */
export function getList(data) {
  return request({
    url: '/admin/member/car/getCarIndex',
    method: 'post',
    data
  })
}
