import {localStorage,sessionStorage,cookie} from '@/utlis/utlis.js'

const cart=localStorage('get','cart')?JSON.parse(localStorage('get','cart')):[];
const cartNum=localStorage('get','cartNum');

const state={
	cartNum:cartNum || 0,
	cart:cart || []
}
const mutations={
	SETCART(state,info){
		if(!state.cart.some(n=>n.psku==info.psku)){
			state.cart.push(info);
		}else{
			state.cart.forEach(n=>{
				if(n.psku==info.psku){
					if(n.addCart){  //是否是购物车添加得数量
						n.num=info.num
						delete n.addCart;  //删除标识
					}else{
						n.num+=info.num
					}
				}
			})
		}
		let cartNum=0
		state.cart.forEach(n=>{
			cartNum+=Number(n.num)
		})
		state.cartNum=cartNum
		localStorage('set','cart',JSON.stringify(state.cart))
		localStorage('set','cartNum',cartNum)
	},
	DELCART(state,sku){
		state.cart=state.cart.filter(n=>n.psku!=sku)
		let cartNum=0
		state.cart.forEach(n=>{
			cartNum+=Number(n.num)
		})
		state.cartNum=cartNum
		localStorage('set','cart',JSON.stringify(state.cart))
		localStorage('set','cartNum',cartNum)
	},
	DELALLCART(state){
		state.cart=[];
		state.cartNum=0
		localStorage('remove','cart')
		localStorage('remove','cartNum')
	}
}

export default {
	namespaced: true,
	state,
	mutations
}