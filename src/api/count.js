import request from '@/utils/request'

/**
 * 统计管理
 */
export function carwash(data) {
    return request({
        url: '/admin/sys/Payment/carwash',
        method: 'post',
        data
    })
}

/**
 * 未结算的销售订单
 */
export function unliquidated(data) {
    return request({
        url: '/admin/sys/Payment/unliquidated',
        method: 'post',
        data
    })
}
/**
 * 已认证会员统计
 */
export function userstatistics(data) {
    return request({
        url: '/admin/sys/Payment/userstatistics',
        method: 'post',
        data
    })
}
