import request from '@/utils/request'

/**
 * 设备列表
 * @param {int} pageNo 页码
 * @param {int} pageSize 分页大小
 * @param {String} shop_name 店铺名称（搜索条件）
 * @param {string} mobile 电话（搜索条件）
 * @param {String} nickname 店长昵称（搜索条件）
 */
export function operateList(data) {
  return request({
    url: '/admin/sys/operate/index',
    method: 'post',
    data
  })
}
