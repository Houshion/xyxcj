const state = {
  nav: [1]
}

const mutations = {
  SET_NAV: (state, nav) => {
    state.nav.push(nav)
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
