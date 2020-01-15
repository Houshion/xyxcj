import request from '@/utils/request'

/**
 * 消息列表
 */
export function message(data) {
  return request({
    url: '/admin/message/message/index',
    method: 'post',
    data
  })
}
