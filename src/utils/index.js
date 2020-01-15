/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  let format = cFormat ? cFormat : '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * 转换时间
 * @author Ocean
 * @param {int} time 传入时间戳
 * @param {string} ff 转换日期格式 Y-m-d 等，下方有著明
 */
export function timeStr(time, ff) {
  if (time == 0) return "/"
  ff = ff ? ff : "Y-m-d H:i:s"
  if (Number(time).toString().length == 10) {
    time = Number(time + "000")
  }
  time = new Date(time);
  var year = time.getFullYear();
  var month =
    time.getMonth() + 1 < 10 ?
    "0" + (time.getMonth() + 1) :
    time.getMonth() + 1;
  var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  var minute =
    time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  var second =
    time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  if (ff == "Y-m-d") {
    return year + "-" + month + "-" + date;
  } else if (ff == "Y-m-d H:i:s") {
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  } else if (ff == "Y-m-d H:i") {
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  } else if (ff == "Y.m.d") {
    return year + "." + month + "." + date;
  } else if (ff == "Y.m.d H:i:s") {
    return (
      year +
      "." +
      month +
      "." +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  } else if (ff == "Y.m.d H:i") {
    return year + "." + month + "." + date + " " + hour + ":" + minute;
  }
}
