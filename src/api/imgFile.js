import request from '@/utils/request'

/**
 * 上传图片
 * @param {int} type 1图片 2视频 3文件
 * @param {any} img 上传的文件
 */
export function upload(data) {
  return request({
    url: '/api/Public/upload',
    method: 'post',
    data
  })
}
