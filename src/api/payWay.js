import request from '@/utils/request'

/**
 * 支付方式列表
 */
export function paymentIndex(data) {
    return request({
        url: '/admin/order/payment_type/index',
        method: 'post',
        data
    })
}
/**
 * 支付方式编辑
 */
export function paymentEdit(data) {
    return request({
        url: '/admin/order/payment_type/edit',
        method: 'post',
        data
    })
}
/**
 * 支付方式添加
 */
export function paymentAdd(data) {
    return request({
        url: '/admin/order/payment_type/add',
        method: 'post',
        data
    })
}
/**
 * 支付方式删除
 */
export function paymentDele(data) {
    return request({
        url: '/admin/order/payment_type/delete',
        method: 'post',
        data
    })
}
/**
 * 支付方式详情
 */
export function paymentDetail(data) {
    return request({
        url: '/admin/order/payment_type/detail',
        method: 'post',
        data
    })
}


