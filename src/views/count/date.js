export default {
  shortcuts: [ {
    text: '当天',
    start: new Date(),
    end:''
  },{
    text: '近一周',
    start: new Date().getTime() - 3600 * 1000 * 24 * 7,
    end:new Date(),
  }, {
    text: '近一个月',
    start: new Date().getTime() - 3600 * 1000 * 24 * 30,
    end:new Date(),
  },
    {
      text: '近一年',
      start: new Date().getTime() - 3600 * 1000 * 24 * 365,
      end:new Date(),
    }
  ]
}
