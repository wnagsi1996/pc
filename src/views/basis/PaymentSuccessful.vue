<template>
	<div>
		<Header />
		<div class="payment-box">
			<div class="payscuccess-dox">
				<div class="left-icon">
					<i class="el-icon-success"></i>
				</div>
				<div class="right-info">
					<div class="name">Payment Successful!</div>
					<div class="desc">You have successful made your payment</div>
					<el-link type="primary" @click="_handToUrl">View Order</el-link>
				</div>
			</div>
		</div>
		<div class="more-love">
			<moreLove :list="list" />
		</div>
		<Footer />
	</div>
</template>

<script>
	import {Link} from 'element-ui'
	export default({
		name:'PaymentSuccessful',
		data(){
			return{
				orderno:this.$route.query.orderno,
				list:[]
			}
		},
		components:{
			[Link.name]:Link,
			MoreLove:()=>import('@/components/MoreLove')
		},
		beforeRouteEnter(to,from,next) {
			next()
			//if(from.orderno=='' || !from.orderno){
			//	next(to.path);
			//}else{
			//	next()
			//}
		},
		created() {
			this.getMoreLove();
		},
		methods:{
			_handToUrl(){
				this.$router.push({path:'/myorder',query:{orderno:this.orderno}})
			},
			//获取推荐产品
			getMoreLove(){
				this.$api.product.getTopProductList().then(res=>{
					console.log(res)
					if(res.rows!='' && res.rows.length>0){
						this.list=res.rows;
					}
				}).catch(err=>{
					console.log(err)
				})
			},
		}
	})
</script>

<style lang="scss" scoped>
	.payment-box{
		background-color: #d9ffd9;
		padding:30px 0;
		.payscuccess-dox{
			width: 500px;
			margin: 0 auto;
			display: flex;
			.left-icon{
				width: 100px;
				i{
					font-size: 72px;
					color: $text-color-success;
				}
			}
			.right-info{
				flex: 1;
				.name{
					font-size: $text-size-lg;
				}
				.desc{
					padding:10px 0;
					color: $text-color-two;
				}
			}
		}
	}
	.more-love{
		width: 100%;
		max-width: $doc-width;
		margin:50px auto;
	}
</style>
