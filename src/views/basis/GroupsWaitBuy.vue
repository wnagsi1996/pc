<template>
	<div>
		<Header />
		<div class="coninter">
			<el-row :gutter="24">
				<el-col :span="8">
					<el-image lazy :src="orderInfo.shareimg" ></el-image>
				</el-col>
				<el-col :span="16">
					<div>
						<div class="head">
							<div class="title">{{orderInfo.pname}}</div>
							<div class="price">
								<span>Group Buy Price:</span>
								<span>${{orderInfo.pprice}}</span>
							</div>
						</div>
						<div class="content">
							<div class="node" v-if="orderInfo.state==0 || orderInfo.state==4">
								<p>Invited <em>{{orderInfo.psalenum}}</em> person to buy successfully</p>
								<div class="time">
									<span>Remaining </span>
									<CountDown :time="orderInfo.djsms" :isminisecond="true" @finish="getOrderInfo"></CountDown>
								</div>
							</div>
							<div v-else-if="orderInfo.state==1" class="pd-status">
								<i class="el-icon-success"></i>
								<span>Group Buy Success</span>
							</div>
							<div v-else class="pd-status">
								<i class="el-icon-error"></i>
								<span>Group Buy Fail</span>
							</div>
							<div class="user">
								<el-image class="img" fit="scale-down" :src="liimgs[0]"></el-image>
								<el-image class="img" fit="scale-down" :src="showHelpImg"></el-image>
							</div>
							<div class="share-box" v-if="orderInfo.state==0 || orderInfo.state==4">
								<p>Invite friends</p>
								<ShareIcon class="share-icon" />
							</div>
							
						</div>
						<!-- 拼购 -->
						<div class="groupbuy-item">
						 <div class="groupbuy-item-title">
							 <span>Discount for Two Rules</span>
							 <!-- <router-link to="/freerule">View More</router-link> -->
						 </div>
						 <div class="groupbuy-item-info">
							 If a Group Buy consists of less than 2 buyers, a refund will be automatically transferred into your account.
						 </div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<Footer />
	</div>
</template>

<script>
	export default({
		name:'GroupsWaitBuy',
		components:{
			ShareIcon:()=>import('@/components/ShareIcon'),
			CountDown:()=>import('@/components/CountDown')
		},
		data(){
			return{
				orderno:this.$route.params.orderno, //拼团订单号
				orderInfo:{},
				liimgs:[],
				djstxt:''
			}
		},
		beforeRouteEnter(to,from,next) {
			if(to.params.orderno && to.params.orderno!=''){
				next()
			}else{
				next(from.path);
			}
		},
		computed:{
			showHelpImg(){
				return this.liimgs[1]?this.liimgs[1]:require('../../assets/image/group-icon1.png')
			}
		},
		created() {
			this.getOrderInfo();
		},
		methods:{
			//获取订单状态
			async getOrderInfo(){
				this.$loading.load();
				try{
					const res=await this.$api.product.getPDProductOrder_FreeWait({pdorderno:this.orderno})
					console.log(res) //状态0：拼单中 1：已经完成拼单 2：拼单失败 4:已经支付（等待第三方回调确认）
					if(res.rescode==0){
						this.liimgs=res.liimgs.split(',');
						this.orderInfo=Object.assign({},res)
						// this.setCountdown()
					}else if(res.rescode==2){
						let orderno=res.resdesc;
						this.$router.push(`/groupbuy/${res.resdesc}`)
					}else{
						this.$message.warning('data loading fail')
					}
					this.$loading.unLoad();
				}catch(e){
					//TODO handle the exception
					this.$loading.unLoad();
				}
				
			}
		}
	})
</script>

<style lang="scss" scoped>
	.head{
		.price{
			margin:10px 0;
			span:first-child{
				color:$text-color-two;
			}
			span:last-child{
				color:$text-color-brand;
				font-size:$text-size-lg;
			}
		}
	}
	.content{
		width: 500px;
		margin:20px auto 0;
		text-align: center;
		background-color: #fff;
		// box-shadow: $box-shadow-deep;
		padding: 20px 10px;
		border-radius: $border-radius-sm;
		.node{
			font-size: $text-size-lg;
			>p{
				em{
					color:$text-color-brand-fu;
					font-size: $text-size-lg;
				}
				
			}
			.time{
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20px;
			}
		}
		.pd-status{
			font-size: $text-size-2x;
			vertical-align: middle;
			i{
				padding-right: 10px;
				font-size: $text-size-3x;
				&.el-icon-success{
					color:$text-color-success;
				}
				&.el-icon-error{
					color:$text-color-brand;
				}
			}
		}
		.user{
			margin-top: 20px;
			.img{
				width: 100px;
				height: 100px;
				border-radius: 50px;
				margin:0 20px;
			}
		}
		.share-box{
			margin-top: 20px;
			display: flex;
			align-items: center;
			p{
				margin:10px;
				font-size: $text-size-lg;
				transform: translateY(-4px);
			}
			.share-icon{
				display: flex;
				justify-content: center;
			}
		}
	}
	.groupbuy-item{
		width:500px;
		padding:15px;
		display: flex; 
		flex-direction: column;
		background-color: #fff;
	}
	.groupbuy-item-title{
		display: flex;
		span{
			display: inline-block; 
			flex: 1;
		}
		a{
			width:80px;
			display: inline-block;
			text-align: right;
			color: $text-color-brand;
		}
	}
	.groupbuy-item-info{
		padding:10px 0;
		color:$text-color-two;
	}
</style>
