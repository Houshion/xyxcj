import request from '@/utils/request'

export function home(data) {
    return request({
        url: '/admin/sys/operate/home',
        method: 'post',
        data
    })
}
