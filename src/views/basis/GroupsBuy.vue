<template>
	<div>
		<Header ref="header" />
		<div class="coninter">
			<el-row :gutter="24">
				<el-col :span="8">
					<el-image lazy :src="orderInfo.shareimg" ></el-image>
					<div class="show-txt">
						<p>Invite friends join Group Shopping</p>
						<p>Delivery after Group Shopping successed</p>
						<p>Refund after Group Shopping failed</p>
					</div>
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
						<template v-if="orderInfo.state==0 || orderInfo.state==4">
							<div class="node">
								<p>Invited <em>{{orderInfo.alsoneednum}}</em> person to buy successfully.Remaining:<CountDown :time="orderInfo.djsms" :isminisecond="true" @finish="getOrderInfo"></CountDown></p>
							</div>
							<SKU class="skuinfo" :skuData="skudata" :skuInfo.sync="selectSku" />
							<div class="btn btn-zu" @click="_handBuy(0)">
								<p>${{skuInfo.newPrice_pt}}</p>
								<p>Group Shopping</p>
							</div>
							<div class="group-buy" @click="_handShowGroup">
								<img src="../../assets/image/groupbuy-img.jpg" alt="">
							</div>
						</template>
						
						<!-- <div class="pay-icon">
							<img src="../../assets/image/pay-icon.jpg" alt="">
						</div> -->
						<div class="content">
							<div v-if="orderInfo.state==1" class="pd-status">
								<i class="el-icon-success"></i>
								<span>Group Buy Success</span>
							</div>
							<div v-if="orderInfo.state==2" class="pd-status">
								<i class="el-icon-error"></i>
								<span>Group Buy Fail</span>
							</div>
							
							<div class="user" v-if="orderInfo.state==1 || orderInfo.state==2">
								<el-image class="img" fit="scale-down" :src="liimgs[0]"></el-image>
								<el-image class="img" fit="scale-down" :src="showHelpImg"></el-image>
							</div>
							
						</div>
						<!-- 拼购 -->
						<div class="groupbuy-item" v-if="orderInfo.state==0 || orderInfo.state==4">
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
		<!-- 规则 -->
		<el-dialog
		  :visible.sync="dialogGroup"
		  width="600px"
		  :before-close="handleCloseGroup">
		  <groupShopping />
		</el-dialog>
		<Footer />
	</div>
</template>

<script>
	import {Dialog} from 'element-ui'
	import {mapGetters} from 'vuex'
	export default({
		name:'GroupsWaitBuy',
		components:{
			[Dialog.name]:Dialog,
			SKU:()=>import('@/components/SKU'),
			groupShopping:()=>import('@/components/groupShopping'),
			CountDown:()=>import('@/components/CountDown')
		},
		data(){
			return{
				orderno:this.$route.params.orderno, //拼团订单号
				orderInfo:{},
				liimgs:[],
				djstxt:'',
				skudata:{},
				selectSku:{},
				dialogGroup:false,
				productData:{},
				btnload:true
			}
		},
		beforeRouteEnter(to,from,next) {
			if(to.params.orderno && to.params.orderno!=''){
				next()
			}else{
				if(from.path!=''){
					next(from.path);
				}else[
					next('/')
				]
				
			}
		},
		computed:{
			skuInfo(){
				const checkSku=this.selectSku;
				let obj={}
				if(checkSku.sku){
					obj={
						oldPrice:checkSku.pscjg,
						newPrice_pt:checkSku.price_pt?checkSku.price_pt:checkSku.price,
						newPrice:checkSku.price,
						stock:Number(checkSku.kc)
					}
					
				}else{
					let productData=this.productData;
					obj={
						oldPrice:productData.showpscjg,
						newPrice_pt:productData.showspjg_pt?productData.showspjg_pt:productData.showspjg,
						newPrice:productData.showspjg,
						stock:Number(productData.pkc)
					}
				}
				obj.showImg=checkSku.showImg?checkSku.showImg:''
				return obj;
			},
			showHelpImg(){
				return this.liimgs[1]?this.liimgs[1]:require('../../assets/image/group-icon1.png')
			},
			...mapGetters([
				'isLogin'
			])
		},
		created() {
			this.getOrderInfo();
		},
		methods:{
			//获取详情信息
			async getProductDetail(pid){
				this.$loading.load()
				const res=await this.$api.product.getSCProductInfo({pid})
				this.$loading.unLoad()
				if(Object.keys(res).length>0){
					this.productData=res;
					if(res.psku==''){
						this.getAttr(pid)
					}
				}
			},
			//获取属性
			getAttr(pid){
				this.$loading.load()
				this.$api.product.getSCProductColumnsSKU({pid,ifpd:0}).then(res=>{
					this.$loading.unLoad()
					if(res!=''){
						this.skudata=res
					}
				}).catch(err=>{
					this.$loading.unLoad()
					console.log(err)
				})
			},
			//获取订单状态
			async getOrderInfo(){
				//this.$loading().load();
				try{
					this.$loading.load()
					const res=await this.$api.product.getPDProductOrder_FreeHelp({pdorderno:this.orderno})
					console.log(res) //状态0：拼单中 1：已经完成拼单 2：拼单失败 4:已经支付（等待第三方回调确认）
					if(res.rescode==0){
						if(res.state==0){
							this.getProductDetail(res.pid)
						}
						this.liimgs=res.liimgs.split(',');
						this.orderInfo=Object.assign({},res)
						this.$loading.unLoad()
						// this.setCountdown()
					}else if(res.rescode==2){
						let orderno=res.resdesc
					}else if(res.rescode==4){
						this.$router.push(`/groupswaitbuy/${res.resdesc}`)
					}else{
						this.$message.warning('data loading fail')
					}
					//this.$loading().unLoad();
				}catch(e){
					//TODO handle the exception
					//this.$loading().unLoad();
				}
			},
			//显示规则
			_handShowGroup(){
				this.dialogGroup=true;
			},
			//隐藏规则
			handleCloseGroup(){
				this.dialogGroup=false;
			},
			_handBuy(){
				//num  0拼团  1正常购买  2 Share Get 3参与拼团
				
				if(!this.isLogin){
					this.$refs.header.showLogin()
					return;
				}
				if(this.btnload){
					this.btnload=false
				}else{
					return;
				}
				let checkSku=this.selectSku;
				let productData=this.productData;
				if(Object.keys(checkSku).length==0 && productData.psku==''){
					this.$message.warning('Select product attributes');
					this.btnload=true
					return;
				}
				let {psku}=this.productData;
				let selsku=Object.keys(checkSku).length>0?checkSku.sku:psku;
				this.$router.push({path:'/payment',query:{sku:selsku,num:1,ispt:1,ptorderno:this.orderno}})
				
			}
		}
	})
</script>

<style lang="scss" scoped>
	.show-txt{
		margin-top: 20px;
		p{
			padding:5px 0;
		}
	}
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
	.node{
		margin-top: 20px;
		font-size: $text-size-lg;
		>p{
			display: flex;
			align-items: flex-end;
			em{
				color:$text-color-brand-fu;
				font-size: $text-size-md;
			}
			
		}
	}
	.skuinfo{
		margin-top: 40px;
	}
	.group-buy{
		margin-top: 30px;
	}
	.content{
		width: 500px;
		margin:30px auto 0;
		text-align: center;
		background-color: #fff;
		// box-shadow: $box-shadow-deep;
		padding: 20px 10px;
		border-radius: $border-radius-sm;
		
		.pd-status{
			display: flex;
			align-items: center;
			justify-content: center;
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
			span{
				font-size: $text-size-lg;
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
	.btn{
		width: 180px;
		height: 40px;
		line-height: 24px;
		padding:10px 0 18px 0;
		margin:0 10px 0 0;
	}
	.btn-zu{
		@include  buttonBrand;
	}
</style>
