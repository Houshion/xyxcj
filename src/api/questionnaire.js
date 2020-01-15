import request from '@/utils/request'




/**
 * 参与列表
 * @param {String} title       标题，非必传
 * @param {String} pageNo      页数
 * @param {String} pageSize    条数
 */
export function answer_list(data) {
  return request({
    url: '/admin/question/question/answer_list',
    method: 'post',
	data
  })
}


/**
 * 问卷列表
 * @param {String} title       标题，非必传
 * @param {String} pageNo      页数
 * @param {String} pageSize    条数
 */
export function question(data) {
  return request({
    url: '/admin/question/question/index',
    method: 'post',
	data
  })
}

/**
 * 问卷删除
 * @param {String} id       标题，非必传
 */
export function questionDele(data) {
  return request({
    url: '/admin/question/question/delete',
    method: 'post',
    data
  })
}

/**
 * 问卷生成报告
 * @param {String} id       标题，非必传
 * pageNo	T文本	是 页码
 * pageSize	T文本	是每页条数
 */
export function report(data) {
  return request({
    url: '/admin/question/question/report',
    method: 'post',
    data
  })
}

/**
 * 问卷添加
 * title	T文本	是 问卷标题
 * endtime	T文本	是 截止时间
 * money	T文本	是奖励金额
 * group_ids	T文本	是会员组，逗号拼接
 * data[0][question]	T文本	是问题标题
 * data[0][input_type]	T文本	是选项类型radio单选，checkbox复选
 * data[0][answer_item]	T文本	是问题选项，以 | 拼接
 * data[1][question]	T文本	是
 * data[1][input_type]	T文本	是
 * data[1][answer_item]	T文本	是
 */
export function questionAdd(data) {
  return request({
    url: '/admin/question/question/add',
    method: 'post',
    data
  })
}
/**
 * 问卷编辑
 * id	T文本	否问卷ID
 * title	T文本	是 问卷标题
 * endtime	T文本	是 截止时间
 * money	T文本	是奖励金额
 * group_ids	T文本	是会员组，逗号拼接
 * data[0][question_id]	T文本	是问题ID，新增问题时不用传值
 * data[0][question]	T文本	是问题标题
 * data[0][input_type]	T文本	是选项类型radio单选，checkbox复选
 * data[0][answer_item]	T文本	是问题选项，以 | 拼接
 * data[1][question]	T文本	是
 * data[1][input_type]	T文本	是
 * data[1][answer_item]	T文本	是
 */
export function questionEdit(data) {
  return request({
    url: '/admin/question/question/edit',
    method: 'post',
    data
  })
}

/**
 * 问卷详情
 * @param id	T文本	否 问卷ID
 */
export function questionDetail(data) {
  return request({
    url: '/admin/question/question/detail',
    method: 'post',
    data
  })
}

/**
 * 问卷题删除
 * @param id	T文本	否问卷题id,多个逗号拼接
 */
export function questionItemDele(data) {
  return request({
    url: '/admin/question/question/question_del',
    method: 'post',
    data
  })
}

/**
 * 问卷题详情
 * @param id	T文本	否问卷题id,多个逗号拼接
 */
export function questionItemDetail(data) {
  return request({
    url: '/admin/question/question/question_detail',
    method: 'post',
    data
  })
}
/**
 * 问卷题编辑
 * @param id	T文本	否问卷题id,多个逗号拼接
 */
export function questionItemEdit(data) {
  return request({
    url: '/admin/question/question/question_edit',
    method: 'post',
    data
  })
}
