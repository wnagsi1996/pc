<template>
	<div>
		<div class="product-item" @click="_handToUrl(item.ptitle,item.pid)">
			
			<!-- <a target="_blank" :href="'/product/'+encodeURIComponent(item.ptitle)+'/'+item.pid"> -->
				<div class="img">
					<el-image lazy :src="item.pimg" />
				</div>
				<div class="info">
					<div class="title">{{item.ptitle}}</div>
					<template v-if="item.ifcp">
						<div class="price">
							<div class="old">${{item.price}}</div>
						</div>
						<div class="bottom">Share Get</div>
					</template>
					<template v-else>
						<div class="price">
							<div class="new">${{item.pjg}}</div>
							<div class="old">${{item.pscjg}}</div>
						</div>
						<div class="bottom">Free Shipping</div>
					</template>
					
				</div>
			<!-- </a> -->
			<div class="quick" @click.stop="_handQuick(item.pid)" v-if="quickShow">Quick View</div>
		</div>
		<el-dialog
		  :visible.sync="dialogVisible"
		  width="1000px"
		  :before-close="handCloseDialog">
		  <miniProductDetail :pid="pid" @closeDialog="handAutoClose" />
		</el-dialog>
		
		<!-- 登录 -->
		<el-dialog
		  :visible.sync="loginDialog"
		  width="400px"
		  :before-close="handleClose">
		  <mini-login @closeDialog="handleAutoLoginClose" />
		</el-dialog>
	</div>
	
</template>

<script>
	import {Dialog} from 'element-ui'
	import miniProductDetail from '@/components/miniProductDetail'
	import miniLogin from '@/components/miniLogin'
	export default({
		name:'productItem',
		components:{
			miniProductDetail,
			[Dialog.name]:Dialog,
			miniLogin
		},
		props:{
			item:Object,
			//是否显示快速查看按钮
			quickShow:{
				type:Boolean,
				default:true
			},
			//是否新页面打开
			target:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				pid:'',
				dialogVisible:false,
				loginDialog:false ,//登录显示隐藏
			}
		},
		methods:{
			_handQuick(pid){
				this.pid=pid;
				this.dialogVisible=true
			},
			handCloseDialog(){
				this.dialogVisible=false
				this.pid='';
			},
			handAutoClose(type=true){
				this.dialogVisible=false
				if(type){
					this.loginDialog=true
				}
			},
			
			handleClose(){
				this.loginDialog=false
			},
			handleAutoLoginClose(){
				this.loginDialog=false
				this.dialogVisible=true
			},
			_handToUrl(title,pid){
				const url='/product?pid='+pid;
				if(this.target){
					window.open(url, '_blank')
				}else{
					this.$router.push(url)
				}
				
			}
		}
	})
</script>

<style lang="scss" scoped>
	.product-item{
		width:300px;
		margin:25px 0;
		position: relative;
		cursor: pointer;
		.img{
			width: 300px;
			height: 300px;
		}
		.info{
			margin-top: 8px;
			.title{
				@include heightHiddens(2)
			}
			.price{
				display: flex;
				align-items: flex-end;
				padding:12px 0;
				.new{
					color:$text-color-brand;
					font-weight: bold;
					font-size:20px;
					padding-right: 8px;
				}
				.old{
					@include strikethrough;
				}
			}
			.bottom{
				color:$text-color-brand;
			}
		}
		.quick{
			width: 130px;
			height: 40px;
			line-height: 40px;
			text-align: center;
			background-color: $bj-color-brand;
			color:#fff;
			position: absolute;
			left: 85px;
			top: 130px;
			transform: scale(0);
			transition: .5s all;
		}
		&:hover{
			.quick{
				transform: scale(1);
			}
		}
	}
</style>
