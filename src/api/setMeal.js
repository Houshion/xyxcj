import request from '@/utils/request'

/**
 * 洗车套餐列表
 */
export function carIndex(data) {
    return request({
        url: '/admin/sys/taocan/index',
        method: 'post',
        data
    })
}

/**
 * 洗车套餐添加/编辑
 */
export function carAdd(data) {
    return request({
        url: '/admin/sys/taocan/add',
        method: 'post',
        data
    })
}

/**
 * 洗车套餐详情
 */
export function carDetail(data) {
    return request({
        url: '/admin/sys/taocan/info',
        method: 'post',
        data
    })
}

/**
 * 洗车套餐删除
 */
export function carDel(data) {
    return request({
        url: '/admin/sys/taocan/delete',
        method: 'post',
        data
    })
}

/**
 * 充值套餐列表
 */
export function moneyIndex(data) {
    return request({
        url: '/admin/sys/money_taocan/index',
        method: 'post',
        data
    })
}
/**
 * 充值套餐详情
 */
export function moneyDetail(data) {
    return request({
        url: '/admin/sys/money_taocan/info',
        method: 'post',
        data
    })
}
/**
 * 充值套餐删除
 */
export function moneyDel(data) {
    return request({
        url: '/admin/sys/money_taocan/delete',
        method: 'post',
        data
    })
}
/**
 * 充值套餐添加/编辑
 */
export function moneyAdd(data) {
    return request({
        url: '/admin/sys/money_taocan/add',
        method: 'post',
        data
    })
}
