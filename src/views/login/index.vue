<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <!-- <h3 class="title">{{$t('login.title')}}</h3> -->
        <h3 class="title">{{isLogin?$t('LoginPage.title'):$t('LoginPage.cardTitle')}}</h3>
      </div>
      <div v-if="isLogin">
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('LoginPage.mobile_placeHolder')"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('LoginPage.password_placeHolder')"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >{{$t('LoginPage.login')}}</el-button>
      </div>
      <div v-else>
        <el-form-item>
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input
            ref="iccard"
            v-model="iccard"
            :placeholder="$t('login.cardPlaceholder')"
            type="text"
            @keyup.enter.native="change"
          />
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="change"
        >{{$t('LoginPage.login')}}</el-button>
      </div>
      <div v-if="cardLoginStatus">
        <el-button
          type="info"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="cardLogin"
        >{{$t('login.cardLogin')}}</el-button>
      </div>
      <div v-else>
        <el-button
          type="info"
          style="width:100%;margin-bottom:30px;"
          @click="back"
        >{{$t('LoginPage.title')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
// import { validUsername } from '@/utils/validate'
import { login, getInfo } from "@/api/user";

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('请输入用户账号'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: this.$t('LoginPage.mobile_placeHolder') }],
        password: [{ required: true, trigger: 'blur', message: this.$t('LoginPage.password_placeHolder') }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isLogin: false,
      cardLoginStatus: false,
      autofocus: false,
      iccard: '',
    }
  },
  created() {

  },
  mounted() {

  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
  },
  methods: {
    // ...$t,
    // ...mapActions(["user/adminLogin"]),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      const _this = this;
      _this.$refs.loginForm.validate(async valid => {
        // _this.$router.replace({ path: "/" });
        // return;
        if (valid) {
          _this.loading = true;
          try {
            const form = { ..._this.loginForm, login_type: 0 };
            await login(form).then(res => {
              _this.loading = false;
              _this.$message({
                type: 'success',
                message: this.$t('login.loginSuccess')
              });
              // _this.user/adminLogin(res);
              this.$store.dispatch('user/adminLogin', res.authorization)
              getInfo(res.authorization).then(response => {
                if (response.userInfo.type == 1) {
                  _this.$router.replace({ path: "/" });
                } else {
                  _this.$router.replace({ path: "/user" });
                }
              })

              return;
            }).catch(err => {
              _this.loading = false;
              this.loginForm = {
                username: '',
                password: '',
              };
            });

          } catch (error) {
            console.log(error)
            _this.loading = false;
            return;
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cardLogin() {//刷卡登录
      this.isLogin = false;
      this.cardLoginStatus = false;
      this.autofocus = true;
      this.loginForm = {
        username: '',
        password: '',
      };
      setTimeout(() => { this.$refs.iccard.focus(); }, 300)
    },
    back() {//返回
      this.isLogin = true;
      this.cardLoginStatus = true;
      this.loginForm = {
        username: '',
        password: '',
      };
    },
    async change() {//刷卡登录
      this.loading = true;
      const form = { iccard: this.iccard, login_type: 1 };
      try {
        const res = await login(form)
        this.loading = false;
        this.$message({
          type: 'success',
          message: this.$t('login.loginSuccess')
        });
        // _this.user/adminLogin(res);
        this.$store.dispatch('user/adminLogin', res.authorization)
        getInfo(res.authorization).then(response => {
          if (response.userInfo.type == 1) {
            this.$router.replace({ path: "/" });
          } else {
            this.$router.replace({ path: "/user" });
          }
        })
        return;
      } catch (err) {
        this.loading = false;
        this.loginForm = {
          username: '',
          password: '',
        };
      }
    },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: rgba(26, 188, 156, 1);
$light_gray: #666;
$cursor: #666;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: rgba(26, 188, 156, 1);
$dark_gray: #889aa4;
$light_gray: rgba(26, 188, 156, 1);

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 350px;
    max-width: 100%;
    padding: 105px 22px 0;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    margin-top: 200px;
    border-radius: 15px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
