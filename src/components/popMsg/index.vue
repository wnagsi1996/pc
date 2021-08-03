<template>
	<div class="pop" v-if="popRes.pname" :class="{'pop-show':active}" @click="_handToUrl(popRes.purl)">
		<div class="left">
			<div class="name">{{popRes.pname?popRes.pname:'iSHARE'}}</div>
			<div class="info">{{popRes.pmsg}}</div>
		</div>
		<div class="right">
			<i class="el-icon-arrow-right"></i>
		</div>
	</div>
</template>

<script>
	import {sessionStorage} from '@/utlis/utlis.js'
	export default({
		name:'popMsg',
		props:{
			timer:{  //间隔时间，默认8秒
				type:Number,
				default:8000
			}
		},
		data(){
			return{
				popList:[],
				popRes:{},
				active:false
			}
		},
		mounted(){
			setTimeout(()=>{this.getPopMsgList()},3000)
		},
		methods:{
			//获取弹出信息
			async getPopMsgList(){
				let popmsg=sessionStorage('get','popmsg');
				if(popmsg!='' && !popmsg){
					const res=await this.$api.product.getPopMsgList();
					if(res.m.length>0){
						sessionStorage('set','popmsg',JSON.stringify(res.m))
						console.log(res)
						this.popList=res.m;
						this.popRes=res.m[0];
					}
				}else{
					popmsg=JSON.parse(popmsg);
					this.popList=popmsg
				}
				let i=0
				setInterval(()=>{
					this.active=true;
					setTimeout(()=>{
						this.active=false;
					},this.timer/2)
					const length=this.popList.length;
					if(length<i){
						i=0;
					}
					this.popRes=popmsg[i]
					i++;
				},this.timer)
			},
			_handToUrl(url){
				const newurl=url.replace('/p/','?pid=')
				this.$router.push(newurl)
			}
		}
	})
</script>

<style lang="scss" scoped>
	.pop{
		position: fixed;
		z-index: 9;
		left: 50px;
		bottom:50px;
		width: 300px;
		height: 60px;
		border-radius: $border-radius-md;
		background-color: #ccc;
		@include flexBetweeCenter;
		color: #fff;
		padding:0 10px;
		opacity: 0;
		transition: all 1s;
		cursor: pointer;
		// animation: showPop 4s 4s infinite;
		.left{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			@include heightHidden;
			.name{
				font-size: $text-size-md;
				padding-bottom: 5px;
			}
		}
		.right{
			i{
				font-size: $text-size-lg;
			}
		}
	}
	.pop-show{
		opacity: 1;
		transform: translateY(-50px);
	}
	// @keyframes showPop{
	// 	0%{
	// 		opacity: 0;
	// 		transform: translateY(0);
	// 	}
	// 	25%{
	// 		opacity: 1;
	// 		transform: translateY(-50px);
	// 	}
	// 	90%{
	// 		opacity: 1;
	// 		transform: translateY(-50px);
	// 	}
	// 	95%{
	// 		opacity: 0;
	// 		transform: translateY(-50px);
	// 	}
	// 	100%{
	// 		opacity: 0;
	// 		transform: translateY(0);
	// 	}
	// }
</style>
