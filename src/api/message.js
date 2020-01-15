import request from '@/utils/request'


/**
 * 讯息列表
 * @param {String} title       标题，非必传
 * @param {String} pageNo      页数
 * @param {String} pageSize    条数
 */
export function list(data) {
  return request({
    url: '/admin/news/news/index',
    method: 'post',
	data
  })
}




/**
 * 讯息列表添加+编辑
 * @param {String} id         非必传
 * @param {String} title      讯息名称
 * @param {String} content    内容
 * @param {String} link       跳转链接
 * @param {String} is_all     是否所有人 0否1是
 * @param {String} group_ids  会员组ids 逗号拼接
 * @param {String} mid        发送个人  
 */
export function add_save(apiName,data) {
  return request({
    url: '/admin/news/news/'+apiName,
    method: 'post',
	data
  })
}




/**
 * 讯息列表详情
 * @param {String} id        必传

 */
export function detail(data) {
  return request({
    url: '/admin/news/news/detail',
    method: 'post',
		data
  })
}


/**
 * 讯息列表删除
 * @param {String} id        必传

 */
export function del(data) {
  return request({
    url: '/admin/news/news/delete',
    method: 'post',
	data
  })
}


/**
 * 会员组列表
 * @param {String} title       标题，非必传
 * @param {String} pageNo      页数
 * @param {String} pageSize    条数
 */
export function group(data) {
  return request({
    url: '/admin/news/news/member_group',
    method: 'post',
	data
  })
}


/**
 * 会员列表
 * @param {String} title       标题，非必传
 * @param {String} pageNo      页数
 * @param {String} pageSize    条数
 */
export function member(data) {
  return request({
    url: '/admin/news/news/member',
    method: 'post',
	data
  })
}