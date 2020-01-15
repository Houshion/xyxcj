import request from '@/utils/request'

/**
 * 登录日志
 * @param {String} title  广告名称|非必传
 * @param {String} type   类型 1图片 2视频|非必传
 */
export function advertList(data) {
  return request({
    url: '/admin/ad/advert/index',
    method: 'post',
		data
  })
}


/**
 * 获取的店铺列表,网点ID
 * @无param
 */
export function shopId() {
  return request({
    url: '/admin/sys/operate/getshop',
    method: 'post',
  })
}


/**
 * 上传图片
 * @param {String} type  1图片 2视频 3文件
 * @param {String} img   文件
 */
export function upload(data) {
  return request({
    url: '/api/Public/upload',
    method: 'post',
	data
  })
}


/**
 * 广告添加+编辑
 * @param {String} id        非必传
 * @param {String} title     广告名称
 * @param {String} shop_id   网点ID
 * @param {String} detail    图片或视频，逗号拼接
 * @param {String} type      类型 1图片 2视频
 */
export function add_save(apiName,data) {
  return request({
    url: '/admin/ad/advert/'+apiName,
    method: 'post',
		data
  })
}




/**
 * 广告详情
 * @param {String} id        必传

 */
export function detail(data) {
  return request({
    url: '/admin/ad/advert/detail',
    method: 'post',
		data
  })
}


/**
 * 广告删除
 * @param {String} id        必传

 */
export function del(data) {
  return request({
    url: '/admin/ad/advert/delete',
    method: 'post',
		data
  })
}