import request from '@/utils/request'

/**
 * 运营商列表
 * @data {[ String ]}  pageNo 页码 true
 * @data {[ String ]}  pageSize 分页大小 false
 * @data {[ String ]}  status 0冻结1正常 false
 * @data {[ String ]}  keyword 搜索账号/昵称/运营商名/邮箱 false
 * @data {[ String ]}  mobile 搜索联系方式 false
 */

export function getOperatorList(data) {
    return request({
        url: '/admin/seller/member/index',
        method: 'post',
        data
    })
}

/**
 * 运营商详情
 * @data {[ String ]} mid  会员ID true
 */

export function getOperatorDetail(data) {
    return request({
        url: '/admin/seller/member/show',
        method: 'post',
        data
    })
}

/**
 * 添加会员
 * @data {[ String ]} username 登录账号 true
 * @data {[ String ]} password 登录密码/添加必填 true
 * @data {[ String ]} nickname 运营商名称 true
 * @data {[ String ]} mobile 手机号码 true
 * @data {[ timestamp ]} open_time 开通时间 true
 * @data {[ timestamp ]} expire_time 到期时间 true
 * @data {[ Number ]} status 0:锁定/1:正常 false
 */
export function addOperator(data) {
    return request({
        url: '/admin/seller/member/add',
        method: 'post',
        data
    })
}

/**
 * 修改会员/密码/状态
 * @data {[ String ]} mid 会员ID/修改必填 true
 * @data {[ String ]} username 登录账号 false
 * @data {[ String ]} password 登录密码/添加必填 false
 * @data {[ String ]} nickname 运营商名称 false
 * @data {[ String ]} mobile 手机号码 false
 * @data {[ timestamp ]} open_time 开通时间 false
 * @data {[ timestamp ]} expire_time 到期时间 false
 * @data {[ Number ]} status 0:锁定/1:正常 false
 */
export function editOperator(data) {
    return request({
        url: '/admin/seller/member/edit',
        method: 'post',
        data
    })
}

/**
 * 删除会员
 * @data {[ String ]} mid  会员ID,多个英文逗号分隔 true
 */
export function removeOperator(data) {
    return request({
        url: '/admin/seller/member/delete',
        method: 'post',
        data
    })
}
