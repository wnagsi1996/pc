<template>
	<div>
		<Header />
		<div class="coninter" v-if="cart.length>0">
			<div class="cart-left cart-node">
				<div class="name">Items In Cart</div>
				<div class="cart-box">
					<div class="cart-item" v-for="item in cart" :key="cart.sku">
						<div class="cart-img">
							<el-image class="img" :src="item.pimg" fit="scale-down"></el-image>
						</div>
						<div class="cart-center">
							<div class="title info">{{item.ptitle}}</div>
							<div class="price info">${{item.price}}</div>
							<div class="attr info" v-if="item.res_skuattrall">{{item.res_skuattrall | attr}}</div>
							<div class="info">
								<el-input-number size="mini" v-model="item.num" :min="1" @change="_handInputNum(item)" />
							</div>
						</div>
						<div class="cart-del" @click="_handDelCart(item.psku)">
							<i class="el-icon-delete"></i>
						</div>
					</div>
				</div>
				<div class="ckear-all" @click="_handClearAll">Clear All</div>
			</div>
			<div class="cart-right cart-node">
				<div class="cart-total-box">
					<div class="name">Order Summary</div>
					<div class="cart-total">
						<div class="cart-txt">Total</div>
						<div class="cart-total-money">${{totalMoney}}</div>
					</div>
					<el-button class="check-btn" type="primary" @click="_handToUrl(2)">Check Out</el-button>
				</div>
			</div>
		</div>
		<div v-else>
			<div class="cart-null">
				<i class="el-icon-shopping-cart-2"></i>
				<p>Your shopping cart is empty</p>
				<el-button type="primary" @click="_handToUrl(0)">Get Free Gifts</el-button>
				<el-button type="warning" @click="_handToUrl(1)">Shopping</el-button>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import {InputNumber} from 'element-ui'
	import {mapGetters,mapMutations} from 'vuex'
	export default({
		name:'Cart',
		components:{
			[InputNumber.name]:InputNumber
		},
		data(){
			return{
				
			}
		},
		computed:{
			totalMoney(){
				let num=0;
				this.cart.forEach(n=>{
					num+=n.num*n.price;
				})
				return num.toFixed(2)
			},
			...mapGetters([
				'cart'
			])
		},
		methods:{
			//购物车数值变化
			_handInputNum(item){
				item.addCart=true;//添加购物车添加数量变化得标识
				this.addCart(item)
			},
			//删除购物车产品
			_handDelCart(sku){
				this.removeCrat(sku)
			},
			//清空全部
			_handClearAll(){
				this.$confirm('Do you want remove this item from shopping cart?', 'warning', {
				  confirmButtonText: 'Yes',
				  cancelButtonText: 'No',
				  type: 'warning'
				}).then(() => {
					this.clearCrat();
				}).catch(() => {});
			},
			_handToUrl(num){
				if(num==0){
					this.$router.push({path:'/freegifts'})
				}else if(num==1){
					this.$router.push({path:'/productlist'})
				}else if(num==2){
					this.$router.push({path:'/payment'})
				}else{
					this.$router.push({path:'/'})
				}
			},
			...mapMutations({
				addCart:'Cart/SETCART',
				removeCrat:'Cart/DELCART',
				clearCrat:'Cart/DELALLCART'
			})
		},
		filters:{
			attr(val){
				return val.replace('^',' ')
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		width: 100%;
		max-width: $doc-width;
		margin:30px auto;
		display: flex;
		justify-content: space-between;
		.cart-left{
			width: 950px;
			padding:20px;
			background-color: #fff;
			border-radius: $border-radius-md;
			.name{
				font-size: $text-size-lg;
			}
			.cart-box{
				.cart-item{
					display: flex;
					margin:30px 0;
					
					.cart-img{
						width: 100px;
						height: 100px;
						.img{
							width: 100px;
							height: 100px;
						}
					}
					.cart-center{
						flex: 1;
						padding: 0 30px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title{
							width: 730px;
							@include heightHidden;
						}
						.attr{
							color:$text-color-two;
						}
						.price{
							color: $text-color-brand;
							font-weight: bold;
						}
					}
					.cart-del{
						width: 50px;
						text-align: right;
						cursor: pointer;
						i{
							font-size: $text-size-md;
						}
					}
				}
			}
			.ckear-all{
				text-align: right;
				cursor: pointer;
				color: $text-color-brand-fu;
			}
		}
		.cart-right{
			width: 350px;
			.cart-total-box{
				width: 100%;
				padding:20px;
				background-color: #fff;
				border-radius: $border-radius-md;
				.name{
					font-size: $text-size-lg;
				}
				.cart-total{
					margin:20px 0;
					display: flex;
					justify-content: space-between;
					.cart-total-money{
						font-weight: bold;
						color:$text-color-brand
					}
				}
				.check-btn{
					width: 100%;
				}
			}
		}
	}
	.cart-null{
		width: 300px;
		margin:130px auto;
		text-align: center;
		i{
			font-size:72px;
			display: block;
		}
		p{
			margin:30px 0;
		}
	}
</style>
