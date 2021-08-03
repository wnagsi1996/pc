import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/router/routerIntercept.js' //路由守卫
import {
	Button,
	Row,
	Col,
	Icon,
	Message,
	Image,
	MessageBox,
	Notification
} from 'element-ui'
import './assets/icon/iconfont.css'
import loading from '@/utlis/loading.js'
// import VConsole from 'vconsole';
// let vConsole = new VConsole();


//引入公共头部
import Header from '@/components/header'
Vue.component('Header', Header)
//引入公共底部
import Footer from '@/components/footer'
Vue.component('Footer', Footer)

//语言
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Icon.name, Icon)
Vue.component(Image.name, Image)
Vue.prototype.$message = Message;
Vue.prototype.$loading = loading;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;

//引入API，并挂载到实例上
import api from '@/api/index.js'
Vue.prototype.$api = api;

import {
	copy
} from '@/directive/copy.js'
import {
	title
} from '@/directive/title.js'
Vue.directive('copy', copy)
Vue.directive('title', title)


Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
