<template>
	<div>
		<Header ref="header" />
			<div class="coninter">
				<div class="shop-head">
					<div class="left">
						<el-image class="img" :src="shopInfo.simg" fit="scale-down"></el-image>
					</div>
					<div class="right">
						<div class="name">{{shopInfo.sname}}</div>
						<div class="operating">
							<div class="follow" @click="_handFocus"><i class="iconfont" :class="isLike?'icon-like1':'icon-like'"></i>{{followtxt}}</div>
							<div class="follow" @click="_handStore">{{isDetail?'Store Product':'About Us'}}</div>
						</div>
					</div>
				</div>
					<keep-alive>
						<router-view />
					</keep-alive>
			</div>
		<Footer />
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default({
		name:'Shop',
		data(){
			return{
				id:this.$route.params.id,
				shopInfo:{},
				isLike:false
			}
		},
		beforeRouteEnter(to,from,next) {
			if(to.params.id=='' || !to.params.id){
				next(from.path)
			}else{
				next()
			}
		},
		computed:{
			followtxt(){
				return this.isLike?'UnFollow':'Follow';
			},
			isDetail(){
				const {name}=this.$route;
				return name=='ShopDetail'?true:false
			},
			...mapGetters([
				'isLogin'
			])
		},
		created() {
			console.log(this.$route)
			this.getShopData()
			this.getIfUserStoreFocus()
		},
		methods:{
			async getShopData(){
				const res=await this.$api.product.getUserStoreBaseInfoByStoreID({sid:this.id});
				if(res.rescode==0){
					this.shopInfo=Object.assign({},{simg:res.simg,sname:res.sname})
				}else{
					this.$message.warning('Shop data loading fail')
				}
			},
			async getIfUserStoreFocus(){
				const res=await this.$api.product.getIfUserStoreFocus({sid:this.id});
				this.isLike=res==0?false:true
			},
			_handFocus(){
				if(this.isLogin){
					//判断是否是关注状态
					if(!this.isLike){
						this.$api.product.focusUserStore({sid:this.id}).then(res=>{
							if(res=='2'){
								this.isLike=true
								this.$message.success('successful');
							}else{
								this.$message.warning(res);
							}
						})
					}else{
						this.$api.product.cancelUserStoreFocus({sid:this.id}).then(res=>{
							if(res=='2'){
								this.isLike=false
								this.$message.success('successful');
							}else{
								this.$message.warning('Unfollow Fial');
							}
						})
					}
				}else{
					this.$refs.header.showLogin()
				}
				
			},
			_handStore(){
				if(this.isDetail){
					this.$router.push({path:`/shop/${this.id}`})
				}else{
					this.$router.push({path:`/shop/detail/${this.id}`})
				}
			}
		}
	})
</script>

<style scoped lang="scss">
	.shop-head{
		height: 100px;
		box-shadow:$box-shadow-deep;
		padding:20px;
		border-radius: $border-radius-sm;
		display: flex;
		.left{
			width: 100px;
			height: 100px;
			.img{
				width: 100px;
				height: 100px;
			}
		}
		.right{
			margin-left: 20px;
			.name{
				font-size: $text-size-md;
			}
			.operating{
				margin-top:30px;
				display: flex;
				align-items: center;
				.follow{
					width: 150px;
					margin-right: 20px;
					font-size: $text-size-md;
					cursor: pointer;
					display: flex;
					align-items: center;
					color:$text-color-two;
					i{
						margin-right: 4px;
						font-size: 22px;
					}
					.icon-like1{
						color:$text-color-brand;
					}
				}
			}
		}
	}
</style>
