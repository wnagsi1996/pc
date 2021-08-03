import router from './index.js'
import store from '../store/index'
import api from '@/api/index.js'
import {sessionStorage} from '@/utlis/utlis.js'

const isPC=()=>{     
	var userAgentInfo = navigator.userAgent;     
	var Agents = ["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"];     
	var flag = true;     
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;         
		}    
	}     
	return flag; 
}

//路由进入
router.beforeEach(async (to,form,next)=>{
	//判断是否手机端访问
	if(!isPC()){
		if(process.env.NODE_ENV=='production'){
			// window.location.href="https://www.isharelike.com"+to.path;
			sessionStorage('set','automobile',to.fullPath)
			window.location.href="";
			return;
		}
	}else{
		const path=sessionStorage('get','autopc');
		sessionStorage('remove','autopc');
		if(path){
			console.log('/pc'+path.substring(1,path.length-1))
			next(path.substring(1,path.length-1))
		}
		
	}
	//路由是否存在
	if(to.matched.length==0){
		next('/404');
	}
	//为true设置灰色背景
	if(to.meta.bj){
		document.body.style.backgroundColor='#f7f7f7'
	}else{
		document.body.style.backgroundColor='#fff'
	}
	//为页面添加title
	if(to.meta.title){
		document.title=to.meta.title
	}
	
	//保存用户上线ID
	if(to.query.u){
		const {u}=to.query;
		api.user.savetjID({u})
	}
	
	let islogin=store.state.userInfo.islogin;
	if(!islogin){
		await store.dispatch('userInfo/getUserInfo');
		islogin=store.state.userInfo.islogin;
	}
	if(to.meta.isLogin){
		// const islogin=store.state.userInfo.islogin;
		if(!islogin){
			next({path:'/login',query:{tofrom:to.path}})
		}
	}
	//登录，注册，忘记密码页面有登录就跳转到首页
	if(['/login','/register','/forgotpassword'].includes(to.path)){
		if(islogin){
			next('/')
		}else{
			next()
		}
	}else{
		next()
	}
	 document.documentElement.scrollTop=0
	
})