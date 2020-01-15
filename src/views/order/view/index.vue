<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    class="main-article"
    element-loading-text="generate PDF"
  >
    <div class="tar">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="fetchData"
      >{{$t('webOrderAll.print')}}</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="savePDF"
      >{{$t('webOrderAll.download')}}</el-button>
    </div>
    <div ref="content" id="myPrint" class="node-article-content">
      <div class="topMsg flexBetween">
        <div class="logo">
          <p style="width:100px;height:100px;">
            <img src="../../../assets/logo.jpg" alt="">
          </p>
          <!-- <p>公司名称</p> -->
        </div>
        <div class="shpoMsg" v-if="orderMsg.shop">
          <p class="name">{{orderMsg.shop.shop_name}}</p>
          <p class="address">{{orderMsg.shop.address}}</p>
          <p class="mobile">{{orderMsg.shop.mobile}}</p>
        </div>
      </div>
      <div class="middleMsg">
        <div>{{$t('webPrintView.orderNo')}}：{{orderMsg.number}}</div>
        <div>{{$t('webPrintView.creatTime')}}：{{orderMsg.ctime|timeStr}}</div>
        <div>{{$t('webPrintView.nickName')}}：{{orderMsg.member?orderMsg.member.nickname:orderMsg.nickname}}</div>
        <div>{{$t('webPrintView.phone')}}：{{orderMsg.member?orderMsg.member.mobile:'/'}}</div>
      </div>
      <div class="orderStatus">
        <div class="statusTitle">{{$t('webPrintView.orderStatus')}}</div>
        <template v-if="orderMsg.income_type!=1">
          <div class="table flex">
            <div class="describe">
              <div class="title">{{$t('webPrintView.describe')}}</div>
              <div
                class="value"
              >{{orderMsg.income_type==0?$t('webOrderAll.orderType_car'):orderMsg.income_type==1?$t('webOrderAll.orderType_sell'):orderMsg.income_type==2?$t('webOrderAll.orderType_expend'):orderMsg.income_type==3?$t('webOrderAll.orderType_rechargeList'):$t('webOrderAll.orderType_recharge')}}</div>
            </div>
            <div class="count">
              <div class="title">{{$t('webPrintView.count')}}</div>
              <div class="value">{{orderMsg.invoice_money}}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="table flex">
            <div class="shops">
              <div class="title">{{$t('webPrintView.describe')}}</div>
              <div
                v-for="(item,index) in orderMsg.invoice_goods"
                :key="index"
                class="value"
              >{{item.goods_info.goods_name}}</div>
            </div>
            <div class="number">
              <div class="title">{{$t('webPrintView.number')}}</div>
              <div
                v-for="(item,index) in orderMsg.invoice_goods"
                :key="index"
                class="value"
              >{{item.goods_info.goods_num}}</div>
            </div>
            <div class="count">
              <div class="title">{{$t('webPrintView.count')}}</div>
              <div
                v-for="(item,index) in orderMsg.invoice_goods"
                :key="index"
                class="value"
              >{{(item.goods_info.goods_price*item.goods_info.goods_num)|toFixed(2)}}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="bottom">
        <div>{{$t('webPrintView.staff')}}：{{orderMsg.cuser?orderMsg.cuser.nickname:''}}</div>
        <div>{{$t('webPrintView.printTime')}}：{{printTime|timeStr}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderDetail } from "@/api/order";
export default {
  data() {
    return {
      article: '',
      fullscreenLoading: false,
      orderMsg: {},
    }
  },
  created() {
    orderDetail({ oid: this.$route.query.id }).then(res => {
      this.orderMsg = res
    })
  },
  computed: {
    printTime() {
      return new Date().toString()
    }
  },
  methods: {
    fetchData() {
      // import('./content.js').then(data => {
      //   const { title } = data.default
      //   document.title = title
      //   this.article = data.default
      setTimeout(() => {
        this.fullscreenLoading = false
        this.$nextTick(() => {
          var newstr = document.getElementById("myPrint").innerHTML;
          var oldstr = document.body.innerHTML;
          document.body.innerHTML = newstr;
          window.print();
          document.body.innerHTML = oldstr;
          return false;
        })
      }, 3000)
      // })
    },
    savePDF() {
      var target = document.getElementById("myPrint");
      target.style.background = "#FFFFFF";
      target.style.padding = "20px";

      html2canvas(target, {
        onrendered: function (canvas) {
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;

          //一页pdf显示html页面生成的canvas高度;
          var pageHeight = contentWidth / 592.28 * 841.89;
          //未生成pdf的html页面高度
          var leftHeight = contentHeight;
          //页面偏移
          var position = 0;
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          var imgWidth = 595.28;
          var imgHeight = 592.28 / contentWidth * contentHeight;

          var pageData = canvas.toDataURL('image/jpeg', 1.0);

          var pdf = new jsPDF('', 'pt', 'a4');

          //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
          } else {
            while (leftHeight > 0) {
              pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight;
              position -= 841.89;
              //避免添加空白页
              if (leftHeight > 0) {
                pdf.addPage();
              }
            }
          }

          pdf.save("order.pdf");
        }
      })
    }
  }
}
</script>

<style lang="scss">
@mixin clearfix {
  &:before {
    display: table;
    content: "";
    clear: both;
  }
  &:after {
    display: table;
    content: "";
    clear: both;
  }
}
.main-article {
  padding: 20px;
  margin: 0 auto;
  display: block;
  width: 595.28px;
  height: 841.89px;
  background: #fff;
  border: 1px solid #000;
}
.article__heading {
  position: relative;
  padding: 0 0 20px;
  overflow: hidden;
}
.article__heading__title {
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 32px;
  line-height: 48px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
}
.node-article-content {
  margin: 20px 0 0;
  @include clearfix;
  font-size: 16px;
  color: #333;
  letter-spacing: 0.5px;
  line-height: 28px;
  margin-bottom: 30px;
  font-family: medium-content-serif-font, Georgia, Cambria, "Times New Roman",
    Times, serif;
  & > :last-child {
    margin-bottom: 0;
  }
  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }
  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
  p {
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
  }
  ul {
    margin-bottom: 30px;
  }
  li {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    letter-spacing: 0.01rem;
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
    margin-left: 30px;
    margin-bottom: 14px;
  }
  a {
    text-decoration: none;
    background-repeat: repeat-x;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.84) 100%,
      rgba(0, 0, 0, 0) 0
    );
    background-size: 1px 1px;
    background-position: 0 calc(1em + 1px);
    padding: 0 6px;
  }
  code {
    background: rgba(0, 0, 0, 0.05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 16px;
    display: inline-block;
  }
  img {
    border: 0;
  }
  /* 解决 IE6-7 图片缩放锯齿问题 */
  img {
    -ms-interpolation-mode: bicubic;
  }
  blockquote {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    font-family: medium-content-serif-font, Georgia, Cambria, "Times New Roman",
      Times, serif;
    letter-spacing: 0.01rem;
    font-weight: 400;
    font-style: italic;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
    border-left: 3px solid rgba(0, 0, 0, 0.84);
    padding-left: 20px;
    margin-left: -23px;
    padding-bottom: 2px;
  }
  a {
    text-decoration: none;
  }
  h2,
  h3,
  h4 {
    font-size: 34px;
    line-height: 1.15;
    letter-spacing: -0.015em;
    margin: 53px 0 0;
  }
  h4 {
    font-size: 26px;
  }
}
body,
#myPrint {
  .middleMsg {
    margin-top: 50px;
    background: #efefef;
    padding: 5px;
  }
  .orderStatus {
    margin-top: 50px;

    .statusTitle {
      margin-bottom: 50px;
    }

    .table {
      .title {
        // border-bottom: #000 1px solid;
      }
      .value {
        border-top: #000 1px solid;
      }
      .describe,
      .count,
      .number,
      .shops {
        text-align: center;
        width: 70%;
        border: 1px solid #000;
        .value {
          padding: 10px;
        }
      }
      .count,
      .number {
        width: 30%;
        border-left: none;
      }
      .shops {
        width: 30%;
      }
    }
  }
  .bottom {
    // position: absolute;
    margin-top: 50px;
  }
}
</style>