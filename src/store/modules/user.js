import {
  getInfo,
  getMenu
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import {
  Message,
} from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  userInfo: '',
  menu: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, info) => {
    state.userInfo = info
  },
  SET_MENU: (state, info) => {
    state.menu = info
  }
}

const actions = {
  // user login
  async adminLogin({
    commit
  }, token) {
    commit('SET_TOKEN', token)
    setToken(token)
    let res = await getInfo(token)
    getInfo(token).then(response => {

    }).catch(error => {
      reject(error)
    })

    console.log(res)
    const {
      userInfo
    } = res

    if (!userInfo) {
      // Message({
      //   type: 'danger',
      //   message: '验证失败，请重新登录。!'
      // });
    }

    const {
      username,
      // avatar
    } = userInfo

    commit('SET_NAME', username)
    commit('SET_USERINFO', userInfo)
    // commit('SET_AVATAR', avatar)

  },

  // get user info
  getInfo({
          commit,
          state
        }) {
          return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
              const {
                userInfo
              } = response

              if (!userInfo) {
                reject('验证失败，请重新登录。')
              }

              const {
                username,
                avatar
        } = userInfo

        console.log(userInfo)

        commit('SET_NAME', username)
        commit('SET_USERINFO', userInfo)
        // commit('SET_AVATAR', avatar)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户权限菜单
  getMenu({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getMenu().then(res => {
        const {
          data
        } = res.data

        console.log("get menu success")

        commit('SET_NAME', username)
        commit('SET_USERINFO', userInfo)
        // commit('SET_AVATAR', avatar)
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
