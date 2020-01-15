import request from '@/utils/request'

/**
 * 分类列表
 */
export function goodsTypeIndex(data) {
    return request({
        url: '/admin/sys/goods_type/index',
        method: 'post',
        data
    })
}
/**
 * 分类添加/编辑
 */
export function goodsTypeAdd(data) {
    return request({
        url: '/admin/sys/goods_type/add',
        method: 'post',
        data
    })
}
/**
 *分类详情
 */
export function goodsTypeInfo(data) {
    return request({
        url: '/admin/sys/goods_type/info',
        method: 'post',
        data
    })
}
/**
 *分类删除
 */
export function goodsTypeDel(data) {
    return request({
        url: '/admin/sys/goods_type/delete',
        method: 'post',
        data
    })
}

/**
 * 商品列表
 */

export function goodsIndex(data) {
    return request({
        url: '/admin/sys/goods/index',
        method: 'post',
        data
    })
}

/**
 * 商品添加/编辑
 */

export function goodsAdd(data) {
    return request({
        url: '/admin/sys/goods/add',
        method: 'post',
        data
    })
}
/**
 * 商品详情
 */

export function goodsInfo(data) {
    return request({
        url: '/admin/sys/goods/info',
        method: 'post',
        data
    })
}
/**
 * 商品删除
 */

export function goodsDel(data) {
    return request({
        url: '/admin/sys/goods/delete',
        method: 'post',
        data
    })
}
