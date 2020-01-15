import request from '@/utils/request'

/**
 * 设备列表
 * @param {String} pageNo 页码
 * @param {String} pageSize 分页大小
 * @param {String} title 设备名称(搜索条件)
 * @param {string} macno 设备号(搜索条件)
 * @param {String} shop_name 所属分店(搜索条件)
 * @param {int} open 启用状态(0停用 1启用)(搜索条件)
 * @param {int} status 1在线2离线(搜索条件)
 */
export function deviceList(data) {
  return request({
    url: '/admin/sys/device/index',
    method: 'post',
    data
  })
}

/**
 * 新增/编辑设备
 * @param {int} id 修改时传
 * @param {String} title 输入设备名称
 * @param {string} macno 设备号
 * @param {int} shop_id 商家id
 * @param {int} sense_len 离场侦测距离设定
 * @param {int} open 0停用 1启用
 */
export function deviceEdit(data) {
  return request({
    url: '/admin/sys/device/add',
    method: 'post',
    data
  })
}

/**
 * 新增/编辑设备
 * @param {string} device_id 设备id，批量删除用,号拼接1,2,3
 */
export function deviceDel(data) {
  return request({
    url: '/admin/sys/device/delete',
    method: 'post',
    data
  })
}

/**
 * 设备详情
 * @param {int} id 设备id
 */
export function deviceInfo(data) {
  return request({
    url: '/admin/sys/device/info',
    method: 'post',
    data
  })
}

/**
 * 更改设备离场侦测状态
 * @param {int} id 设备id
 */
export function setSenseStatus(data) {
  return request({
    url: '/admin/sys/device/setSenseStatus',
    method: 'post',
    data
  })
}

/**
 * 设备列表
 * @param {String} pageNo 页码
 * @param {String} pageSize 分页大小
 * @param {String} title 设备名称(搜索条件)
 * @param {string} macno 设备号(搜索条件)
 * @param {String} shop_name 所属分店(搜索条件)
 * @param {int} open 启用状态(0停用 1启用)(搜索条件)
 * @param {int} status 1在线2离线(搜索条件)
 */
export function sellerDeviceList(data) {
  return request({
    url: '/admin/sys/device/index',
    method: 'post',
    data
  })
}

/**
 * 更改设备离场侦测状态
 * @param {int} id 设备id
 */
export function sellerSetSenseStatus(data) {
  return request({
    url: '/admin/sys/device/setSenseStatus',
    method: 'post',
    data
  })
}

/**
 * 设备添加导入
 * @param {JSON} any 任意key，val为JSON字符串
 */
export function multi_add(data) {
  return request({
    url: '/admin/sys/device/multi_add',
    method: 'post',
    data
  })
}


