<template>
	<div>
		<div class="icon-box">
			<div class="icon" @click="_handShare('Facebook')">
				<i class="iconfont icon-icomoonfacebook2" :style="{color:'#3b5998',fontSize:size+'px'}"></i>
			</div>
			<div class="icon" @click="_handShare('Linkedin')">
				<i class="iconfont icon-LinkedIn" style="color:#3b5998;font-size: 38px;" :style="{color:'#ca2127',fontSize:Number(size)+2+'px'}"></i>
			</div>
			<div class="icon" @click="_handShare('Twitter')">
				<i class="iconfont icon-TwitterIcon" :style="{color:'#00abf1',fontSize:size+'px'}"></i>
			</div>
			<div class="icon" @click="_handShare('Pinterest')">
				<i class="iconfont icon-pinterest" :style="{color:'#ca2127',fontSize:size+'px'}" ></i>
			</div>
		</div>
		<el-dialog
		  :visible.sync="loginDialog"
		  width="400px"
		  :before-close="handleClose">
		  <mini-login @closeDialog="handleClose" />
		</el-dialog>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {Dialog} from 'element-ui'
	import miniLogin from '@/components/miniLogin'
	import {share} from '../../utlis/utlis.js'
	export default({
		name:'ShareIcon',
		components:{
			[Dialog.name]:Dialog,
			miniLogin
		},
		props:{
			size:{
				type:String,
				default:'36'
			}
		},
		data(){
			return{
				loginDialog:false
			}
		},
		computed:{
			...mapGetters([
				'isLogin',
				'userInfo'
			])
		},
		methods:{
			//点击分享
			_handShare(name){
				if(this.isLogin){
					const {uid}=this.userInfo;
					share(name,uid)
				}else{
					this.loginDialog=true;
				}
			},
			// 关闭登录
			handleClose(){
				this.loginDialog=false;
			}
		}
	})
</script>

<style lang="scss" scoped>
	.icon-box{
		display: flex;
		.icon{
			margin:10px;
			cursor: pointer;
			i{
				font-size:$text-size-3x;
			}
		}
	}
</style>
