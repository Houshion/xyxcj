const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  menu: state => state.user.menu,
  nav: state => state.nav.nav,
  language: state => state.app.language
}
export default getters
