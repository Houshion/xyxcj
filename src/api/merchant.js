import request from '@/utils/request'

/**
 * 支出类型列表
 */
export function expensesTypeList(data) {
    return request({
        url: '/admin/sys/operate/expensesTypeList',
        method: 'post',
        data
    })
}
/**
 * 支持类型添加/编辑
 */
export function expensesTypeAdd(data) {
    return request({
        url: '/admin/sys/operate/expensesTypeSet',
        method: 'post',
        data
    })
}
/**
 * 支出类型删除
 */
export function expensesTypeDel(data) {
    return request({
        url: '/admin/sys/operate/expensesTypeDelete',
        method: 'post',
        data
    })
}

/**
 * 分店管理
 */
export function operateIndex(data) {
    return request({
        url: '/admin/sys/operate/index',
        method: 'post',
        data
    })
}
/**
 * 店铺添加/编辑
 */
export function operateAdd(data) {
    return request({
        url: '/admin/sys/operate/add',
        method: 'post',
        data
    })
}
/**
 * 店铺删除
 */
export function operateDel(data) {
    return request({
        url: '/admin/sys/operate/delete',
        method: 'post',
        data
    })
}
/**
 * 店铺详情
 */
export function operateInfo(data) {
    return request({
        url: '/admin/sys/operate/storeinfo',
        method: 'post',
        data
    })
}
/**
 * 店长列表
 */
export function shopownerIndex(data) {
    return request({
        url: '/admin/sys/operate/shopownerList',
        method: 'post',
        data
    })
}
/**
 * 店长添加/编辑
 */
export function shopownerAdd(data) {
    return request({
        url: '/admin/sys/operate/shopownerSet',
        method: 'post',
        data
    })
}
/**
 * 店长删除
 */
export function shopownerDel(data) {
    return request({
        url: '/admin/sys/operate/shopownerDelete',
        method: 'post',
        data
    })
}
/**
 * 店员（店长）详情
 */
export function shopInfo(data) {
    return request({
        url: '/admin/sys/operate/admininfo',
        method: 'post',
        data
    })
}
/**
 * 解绑身份卡
 */
export function untyingIccard(data) {
    return request({
        url: '/admin/sys/operate/untyingIccard',
        method: 'post',
        data
    })
}
/**
 * 添加店员（店长）时获取店铺列表
 */
export function shopList(data) {
    return request({
        url: '/admin/sys/operate/shopList',
        method: 'post',
        data
    })
}
/**
 * 店员列表
 */
export function clerkList(data) {
    return request({
        url: '/admin/sys/operate/clerkList',
        method: 'post',
        data
    })
}
/**
 * 店员添加/编辑
 */
export function clerkSet(data) {
    return request({
        url: '/admin/sys/operate/clerkSet',
        method: 'post',
        data
    })
}
/**
 * 店员删除
 */
export function clerkDelete(data) {
    return request({
        url: '/admin/sys/operate/clerkDelete',
        method: 'post',
        data
    })
}
/**
 * 搜索获取的店铺列表
 */
export function getshop(data) {
    return request({
        url: '/admin/sys/operate/getshop',
        method: 'post',
        data
    })
}

