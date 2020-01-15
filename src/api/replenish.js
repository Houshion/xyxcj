import request from '@/utils/request'

/**
 * 补货员列表
 * @data {[ String ]}  pageNo 页码 true
 * @data {[ String ]}  pageSize 分页大小 false
 * @data {[ String ]}  keyword 搜索账号/昵称/运营商名/邮箱 false
 * @data {[ String ]}  mobile 搜索联系方式 false
 */

export function getReplenishList(data) {
    return request({
        url: '/seller/sys/member/index',
        method: 'post',
        data
    })
}

/**
 * 补货员详情
 * @data {[ String ]} mid  会员ID true
 */

export function getReplenishDetail(data) {
    return request({
        url: '/seller/sys/member/show',
        method: 'post',
        data
    })
}

/**
 * 添加补货员
 * @data {[ String ]} username 登录账号 true
 * @data {[ String ]} password 登录密码/添加必填 true
 * @data {[ String ]} nickname 会员昵称 true
 * @data {[ String ]} mobile 手机号码 true
 * @data {[ String ]} email 电子邮箱 true
 * @data {[ Number ]} status 0:锁定/1:正常 false
 */
export function addReplenish(data) {
    return request({
        url: '/seller/sys/member/add',
        method: 'post',
        data
    })
}

/**
 * 修改补货员/密码/状态
 * @data {[ String ]} mid 会员ID/修改必填 true
 * @data {[ String ]} username 登录账号 false
 * @data {[ String ]} password 登录密码/添加必填 false
 * @data {[ String ]} nickname 运营商名称 false
 * @data {[ String ]} mobile 手机号码 false
 * @data {[ String ]} email 电子邮箱 false
 * @data {[ Number ]} status 0:锁定/1:正常 false
 */
export function editReplenish(data) {
    return request({
        url: '/seller/sys/member/edit',
        method: 'post',
        data
    })
}

/**
 * 删除补货员
 * @data {[ String ]} mid  会员ID,多个英文逗号分隔 true
 */
export function removeReplenish(data) {
    return request({
        url: '/seller/sys/member/delete',
        method: 'post',
        data
    })
}

