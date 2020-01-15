import request from '@/utils/request'

/**
 * 洗车订单
 */
export function washIndex(data) {
  return request({
    url: '/admin/order/order/wash',
    method: 'post',
    data
  })
}

/**
 * 结束洗车订单
 * @param {String} oid ID
 */
export function washFinish(id) {
  return request({
    url: '/admin/order/order/wash_finish',
    method: 'post',
    data: {
      oid: id
    }
  })
}

/**
 * 售卖记账订单
 */
export function incomeIndex(data) {
  return request({
    url: '/admin/order/order/income',
    method: 'post',
    data
  })
}
/**
 * 售卖记账订单详情
 */
export function incomeShow(data) {
  return request({
    url: '/admin/order/order/income_show',
    method: 'post',
    data
  })
}
/**
 * 新增售卖记账订单
 */
export function incomeAdd(data) {
  return request({
    url: '/admin/order/order/income_add',
    method: 'post',
    data
  })
}
/**
 * 新增付款记录
 */
export function paymentAdd(data) {
  return request({
    url: '/admin/order/order/income_payment_add',
    method: 'post',
    data
  })
}
/**
 * 新增付款记录】获取订单信息
 */
export function paymentAddShow(data) {
  return request({
    url: '/admin/order/order/income_payment_add_show',
    method: 'post',
    data
  })
}
/**
 * 删除售卖记账订单
 */
export function incomeDel(data) {
  return request({
    url: '/admin/order/order/income_del',
    method: 'post',
    data
  })
}
/**
 * 取消售卖记账订单
 */
export function incomeCancel(data) {
  return request({
    url: '/admin/order/order/income_cancel',
    method: 'post',
    data
  })
}
/**
 * 编辑售卖记账订单
 */
export function incomeEdit(data) {
  return request({
    url: '/admin/order/order/income_edit',
    method: 'post',
    data
  })
}
/**
 * 支出记账订单
 */
export function expensesIndex(data) {
  return request({
    url: '/admin/order/order/expenses',
    method: 'post',
    data
  })
}
/**
 * 新增支出订单
 */
export function expensesAdd(data) {
  return request({
    url: '/admin/order/order/expenses_add',
    method: 'post',
    data
  })
}
/**
 * 编辑支出订单
 */
export function expensesEdit(data) {
  return request({
    url: '/admin/order/order/expenses_edit',
    method: 'post',
    data
  })
}
/**
 * 支出订单详情
 */
export function expensesShow(data) {
  return request({
    url: '/admin/order/order/expenses_show',
    method: 'post',
    data
  })
}
/**
 * 删除支出记账订单
 */
export function expensesDel(data) {
  return request({
    url: '/admin/order/order/expenses_del',
    method: 'post',
    data
  })
}
/**
 * 取消支出记账订单
 */
export function expensesCancel(data) {
  return request({
    url: '/admin/order/order/expenses_cancel',
    method: 'post',
    data
  })
}
/**
 * 充值订单
 */
export function rechargeIndex(data) {
  return request({
    url: '/admin/order/order/recharge',
    method: 'post',
    data
  })
}
/**
 * 财务流水
 */
export function orderPaymentIndex(data) {
  return request({
    url: '/admin/order/order/payment',
    method: 'post',
    data
  })
}
/**
 * 所有订单
 */
export function allOrderIndex(data) {
  return request({
    url: '/admin/order/order/index',
    method: 'post',
    data
  })
}

/**
 * 订单详情
 */
export function orderDetail(data) {
  return request({
    url: '/admin/order/order/show',
    method: 'post',
    data
  })
}
