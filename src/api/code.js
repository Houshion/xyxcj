import request from '@/utils/request'

/**
 * 电话区号列表
 * @param {int} pageNo 页码
 * @param {int} pageSize 分页大小
 */
export function getList(data) {
  return request({
    url: '/admin/set/number/index',
    method: 'post',
    data
  })
}

/**
 * 电话区号删除
 * @param {int} id id多个逗号拼接
 */
export function dele(data) {
  return request({
    url: '/admin/set/number/delete',
    method: 'post',
    data
  })
}

/**
 * 电话区号添加
 * @param {int} number 区号
 * @param {int} remark 备注
 */
export function add(data) {
  return request({
    url: '/admin/set/number/add',
    method: 'post',
    data
  })
}

/**
 * 电话区号编辑
 * @param {int} id id
 * @param {int} number 区号
 * @param {int} remark 备注
 */
export function save(data) {
  return request({
    url: '/admin/set/number/save',
    method: 'post',
    data
  })
}

/**
 * 电话区号详情
 * @param {int} id id
 */
export function detail(data) {
  return request({
    url: '/admin/set/number/detail',
    method: 'post',
    data
  })
}
