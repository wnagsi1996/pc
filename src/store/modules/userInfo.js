import api from '@/api/index.js'



const state={
	islogin: false,  //是否登录
	userInfo:{}  ,//用户信息
	userCenterInfo:{}  //用户中心用户信息
}
const mutations={
	SETLOGIN(state,set){
		state.islogin=set;
	},
	SETUSERINFO(state,info){
		state.userInfo=info
		
	},
	SET_USERCENTERINFO(state,info){
		state.userCenterInfo=info;
	}
}
const actions={
	// 登录
	login({commit},params){
		return new Promise((resolve,reject)=>{
			api.user.login(params).then(res=>{
				if(res.rescode==0){
					commit('SETLOGIN',true)
				}
				resolve(res)
			})
			.catch(err=>{
				rejlove(err)
			})
		})
	},
	//获取用户信息
	getUserInfo({commit}){
		return new Promise((resolve,reject)=>{
			api.user.getheadUserInfo().then(res=>{
				commit('SETUSERINFO',res);
				if(res.uid!=''){
					commit('SETLOGIN',true);
				}
				resolve(res)
			})
			.catch(err=>{
				reject(err)
			})
		})
	},
	//用户中心获取用户信息
	getUserCenterInfo({commit,state}) {
		return new Promise((resolve,reject) => {
			api.user.getUserCenterInfo().then(res => {
				if (res != '') {
					commit('SET_USERCENTERINFO', res);
				}
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		})
	},
	//退出登录
	singOut({commit}){
		return new Promise((resolve,reject)=>{
			api.user.loginout().then(res=>{
				if (res.rescode == "0") {
					commit('SETUSERINFO',{})
					commit('SET_USERCENTERINFO',{})
					commit('SETLOGIN',false)
					resolve(true)
				}else{
					resolve(false)
				}
			}).catch(err=>{
				reject(false)
			})
		})
	}
}

export default{
	 namespaced: true,
	 state,
	 mutations,
	 actions
}