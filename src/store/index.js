import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from './modules/userInfo.js'
import Cart from './modules/cart.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
	  userInfo,
	  Cart
  },
  getters:{
	  cartNum:state=>state.Cart.cartNum,
	  cart:state=>state.Cart.cart,
	  isLogin:state=>state.userInfo.islogin,
	  userInfo:state=>state.userInfo.userInfo,
	  userCenterInfo:state=>state.userInfo.userCenterInfo
  }
})
