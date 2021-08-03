<template>
	<div>
		<Header />
			<div class="helpinfo">
				<span v-if="helpnc!=''">You have successfully helped <em id="name">{{helpnc}}</em> and you gonna get it free, too.Click Invite Friends to invite your friends to help you now.</span>
			</div>
			
			<div class="coninter">
				<div class="left-box">
					<el-image class="el-img" :src="orderInfo.shareimg" fit="scale-down" />
					<div class="orderno">Order No:{{orderno}}</div>
				</div>
				<div class="right-box">
					<div class="head">
						<div class="title">{{orderInfo.pname}}</div>
						<div class="attr">{{orderInfo.pattrstr}}</div>
					</div>
					<div class="order-status">
						<div class="status">{{orderInfo.pdstate}}</div>
						<div class="timer">{{djsdate}}</div>
					</div>
					<div class="order-sharenow">
						<div class="order-numtxt"  v-if="orderInfo.state==0">
							<i class="el-icon-user-solid"></i>
							<p>Also need invite <em>{{orderInfo.alsoneednum}}</em> Friends to get this product for free</p>
							<el-button type="primary" size="mini" @click="_handShowShare">Invite Friends</el-button>
						</div>
						<div class="order-txt" v-if="orderInfo.state==0">
							Sorry that Wechat offcial rules doesn't allowed us to share this now,<br/>please choose facebook friends to help you.
						</div>
						<div class="show-help">
							<div class="help-friends">Help Friends</div>
							<div class="show-photo" v-if="orderdivShow.length>12" @click="_handshowAll()">View All</div>
							
						</div>
						<div class="order-photo">
							<div class="order-photo-img" v-for="(item,value) in orderdivShowDom" :key="value">
								<img v-if="orderPhoto[value]" :src="orderPhoto[value]" >
								<span v-else>?</span>
							</div>
							<div class="order-photo-img-null" v-for="(item,index) in orderdivShowNull" :key="'0'+index"></div>
						</div>
					</div>
					<div class="order-buy" v-if="orderInfo.state==0">
						<div class="title">The more friends you invite, the less you have to pay.</div>
						<div class="order-btn">
							<p>${{orderInfo.d3fprice}}</p>
							<p>${{orderInfo.curprice}}</p>
							<el-button type="primary" @click="_handBuyShow">Buy Now ${{orderInfo.curprice}}</el-button>
						</div>
					</div>
					<div class="order-address">
						<div class="title"><p>Shipping Address</p> <el-button v-if="orderInfo.state==0" type="primary" size="mini" @click="_handShowAddress">Set Address</el-button></div>
						<div class="info"  v-if="address[0]!=''">
							<div class="name">
								<p>{{address[0]}}</p>
								<p>{{address[1]}}</p>
							</div>
							<div class="desc">{{address[2]}}</div>
						</div>
						<div class="order-set-address" v-else>
							Plz leave your shipping address here first so that we can inform you if you are selected as the winner and then send the shoes out.
						</div>
					</div>
					<div class="rules">
						<div class="name">Activity Rules</div>
						<div class="info">
							<p>1. You just need to invite 16 friends to help you in 7 days.</p>
							<p>2. We will send the product to you after 16 users helped you.</p>
						</div>
					</div>
				</div>
			</div>
		<Footer />
		<!-- 分享 -->
		<el-dialog
		title="Share"
		  :visible.sync="dialogVisible"
		  width="400px"
		  :before-close="handleClose">
		  
		  <ShareIcon size="60" />
		</el-dialog>
		<!-- 地址 -->
		<el-dialog
		title="Setting Address"
		  :visible.sync="dialogAddress"
		  width="700px"
		  :before-close="handleAddressClose">
		 <comment :is="addcom" :pdorderno="orderno" @updateAddress="handleAddressClose"></comment>
		</el-dialog>
		<!-- 支付 -->
		<el-dialog
		title="Disount Price Purchase"
		  :visible.sync="dialogBuy"
		  width="500px"
		  :before-close="handleBuysClose">
		  <div class="buy-box">
			  <div class="buy-title">You have invited {{orderInfo.alsoneednum}} friends, you can buy it with ${{orderInfo.curprice}} directly</div>
			  <div class="buy-info">
				  <div class="pay-info"><span>Price:</span><span>${{orderInfo.d3fprice}}</span></div>
				  <div class="pay-info"><span>Discount Price:</span><span>${{orderInfo.curprice}}</span></div>
				  <div class="pay-info"><span>Balance Payment:</span><span>${{orderInfo.zhye}}</span></div>
				  <div class="pay-info"><span>Pay Extra:</span><span>${{payMoney}}</span></div>
			  </div>
			  <div class="btn">
				  <button class="btn-paypal" v-if="showpay" :loading="disabled" @click="_handBuy">Payapl Pay</button>
				  <el-button type="primary" v-else :loading="disabled" @click="_handBuy">PAY NOW</el-button>
			  </div>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import {Dialog} from 'element-ui'
	import {cmdEncrypt} from "@/assets/js/RSAz.js"
	import {countdown} from '../../utlis/utlis.js'
	export default({
		name:'GroupsWait',
		components:{
			ShareIcon:()=>import('@/components/ShareIcon'),
			[Dialog.name]:Dialog
		},
		data(){
			return{
				orderno:this.$route.params.orderno,  //订单号
				orderInfo:{},   //订单信息
				orderPhoto:[],   //用户头像
				address:[],  //地址
				orderdivShow:[],  //总的需要帮助人数
				djsdate:'',  //倒计时时间
				orderdivShowDom:[],  //默认展示12个帮助人数
				dialogVisible:false  ,//分享显示隐藏
				addcom:null  ,//地址组件
				dialogAddress:false  ,//地址组件显示
				dialogBuy:false  ,//购买弹窗
				showpay:true,
				disabled:false , //按钮状态
				payMoney:0  ,//支付金额
				helpnc:this.$route.query.nc|| '',
				timer:false
			}
		},
		beforeRouteEnter(to,from,next) {
			if(to.params.orderno=='' || !to.params.orderno){
				next(from.fullPath)
			}else{
				next()
			}
		},
		computed:{
			orderdivShowNull(){
				const orderdivShow=this.orderdivShowDom;
				const num=orderdivShow.length%6==0?0:6-(orderdivShow.length%6);
				return num;
			}
		},
		created() {
			this.getOrderInfo(this.orderno)
		},
		methods:{
			//获取订单状态
			getOrderInfo(pdorderno){
				this.$loading.load();
				this.$api.product.getPDProductOrderInfo_Wait({pdorderno}).then(res=>{
					this.$loading.unLoad();
					console.log(res) //状态0：拼单中 1：已经完成拼单 2：拼单失败 4:已经支付（等待第三方回调确认）
					if(res.rescode==0){
						this.orderInfo=Object.assign({},res);
						this.orderPhoto=res.helpUserHeadimg.split(',')
						let orderdivShow=[];
						if(res.state==0){
							for(let i=0;i<res.alsoneednum;i++){
								orderdivShow.push(i);
							}
						}else{
							for(let i=0;i<this.orderPhoto.length;i++){
								orderdivShow.push(i);
							}
						}
						this.orderdivShow=orderdivShow;
						if(orderdivShow.length>12){
							this.orderdivShowDom=orderdivShow.filter(n=>n<12)
						}else{
							this.orderdivShowDom=orderdivShow
						}
						
						this.address=res.UserAddr.split("^");
						this.setDjs();
						document.title=`${this.userInfo.ncname} can get it free and invite you to get free too.${res.pname}`;
					}else{
						this.$router.push({path:`/grouphelp/${res.resdesc}`})
					}
					
					
				}).catch(xhr=>{
					this.$loading.unLoad();
				})
			},
			//倒数计
			setDjs(){
				let {djsms}=this.orderInfo;
				this.timer=setInterval(()=>{
					if(djsms==0){
						clearInterval(this.timer);
					}else{
						this.djsdate=countdown(djsms);
						djsms--
					}
				},1000)
			},
			//显示隐藏人数
			_handshowAll(){
				const orderdivShow=this.orderdivShow;
				let orderdivShowDom=this.orderdivShowDom;
				if(orderdivShow.length==orderdivShowDom.length){
					this.orderdivShowDom=orderdivShow.slice(0,12);
				}else{
					this.orderdivShowDom=orderdivShow
				}
			},
			//显示分享
			_handShowShare(){
				this.dialogVisible=true
			},
			//关闭分享
			handleClose(){
				this.dialogVisible=false
			},
			//显示地址
			_handShowAddress(){
				this.dialogAddress=true
				if(this.addcom==null){
					this.addcom=()=>import('@/components/AddressItem');
				}
			},
			//关闭地址，is为ture代表是编辑过来的
			handleAddressClose(is=false){
				this.dialogAddress=false;
				if(is){
					this.getOrderInfo(this.orderno)
				}
			},
			//显示支付
			_handBuyShow(){
				this.dialogBuy=true;
				let ifjg = (this.orderInfo.d3fprice - this.orderInfo.zhye).toFixed(2);
				if (ifjg > 0) {
					this.payMoney=ifjg
					this.showpay=true
				}else{
					this.payMoney=0;
					this.showpay=false
				}
			},
			//购买
			async _handBuy(){
				let pdj=0 //传回后台的第三方支付金额
				let pye=0 //传给后台余额支付金额
				let ifjg = (this.orderInfo.curprice-this.orderInfo.zhye).toFixed(2);  //产品价格减去余额
				if(ifjg<=0){
					pye = this.orderInfo.curprice;
				}else{
					pdj = ifjg;
					pye = this.orderInfo.zhye
				}
				this.disabled=true
				let zffs=2; //第三方支付方式,1微信 2PayPal
				
				let zfinfos = pdj + "," + pye;
				let zfobj = zfinfos + "|" + this.orderno + "|" + zffs; //支付数据
				let res=await this.$api.verify.CreateRSAKey();
				if(res!=null && res!=''){
					if (res.rescode == 0) {
						 zfobj = cmdEncrypt(zfobj, res.strPublicKeyExponent, res.strPublicKeyModulus, 1);
					}else{
						this.$message.error('Failed to create encrypted data. Please try again.');
						this.disabled=false;
					}
				}else{
					this.$message.error('Failed to create encrypted data. Please try again.');
					this.disabled=false;
				}
				
				
				let resjson=await this.$api.product.CommitPay_Buy_PD({zfobj})
				 if(resjson!=null && resjson!=''){
					if (resjson.fsstate != 0) {
						this.$message.error(resjson.fsmes);
						if(resjson.fsstate==2){  //登录超时
							this.$router.push({path:'/login',query:{tofrom:this.$router.path}})
						}
					}else{
						if(resjson.fzffs==0){  //余额支付
							this.dialogBuy=false;
							this.$message.success('Successful Payment.');
							this.getOrderInfo(this.orderno);
							clearInterval(this.timer);
						}else if(resjson.fzffs==2){  //PayPal支付
							window.location.href = resjson.fsmes;
						}else{
							//微信支付
						}
					}
				 }
				 this.disabled=false
			},
			handleBuysClose(){
				this.dialogBuy=false
			}
		}
	})
</script>

<style lang="scss" scoped>
	.helpinfo{
		max-width: $doc-width;
		margin:15px auto 40px;
		
		span{
			font-size: $text-size-md;
			box-shadow: $box-shadow-deep;
			padding:10px 8px;
			background-color: $bj-color-gray;
			border-radius:$border-radius-sm;
			em{
				font-size: $text-size-md;
				color: $text-color-brand;
			}
		}
		
	}
	.coninter{
		display: flex;
		margin:20px auto;
		.left-box{
			width: 500px;
			.el-img{
				width: 500px;
				height: 500px;
			}
			.orderno{
				text-align: center;
			}
		}
		.right-box{
			flex:1;
			margin-left: 20px;
			.head{
				.title{
					font-size: $text-size-md;
				}
				.attr{
					margin-top: 8px;
					color: $text-color-brand;
				}
			}
			.order-status{
				width: 400px;
				height: 40px;
				line-height: 40px;
				margin:30px 0;
				padding:0 5px;
				color: #fff;
				border-radius: $border-radius-sm;
				background-color: $text-color-brand-fu;
				@include flexBetweeCenter
			}
			.order-sharenow{
				.order-numtxt{
					display: flex;
					align-items: center;
					i{
						font-size:$text-size-2x;
						color:$text-color-brand;
					}
					p{
						em{
							color:$text-color-brand;
						}
						margin-right: 5px;
					}
				}
				.order-txt{
					margin-top: 10px;
					line-height: 24px;
					color:$text-color-two;
				}
				.show-help{
					width: 500px;
					margin:20px 0 10px;
					display: flex;
					justify-content: space-between;
					.show-photo{
						cursor: pointer;
						padding: 0 0 8px 0;
						color: $text-color-brand;
					}
					.help-friends{
						font-size: $text-size-md;
					}
				}
				
				.order-photo{
					width: 500px;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					.order-photo-img{
						width: 70px;
						height: 70px;
						border-radius: 50px;
						border:1px solid $text-color-brand-fu;
						margin:10px 0;
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						span{
							font-size:$text-size-2x;
							color:$text-color-brand;
						}
						img{
							width: 100%;
							height:100%;
						}
					}
					.order-photo-img-null{
						width: 70px;
						height: 70px;
					}
				}
				
			}
			.order-buy{
				width: 450px;
				height: 90px;
				padding:10px;
				margin-top: 30px;
				border-radius:$border-radius-sm;
				border:1px dashed $text-color-three;
				.order-btn{
					display: flex;
					align-items: center;
					margin-top: 20px;
					p:first-child{
						@include strikethrough;
					}
					p:nth-child(2){
						color: $text-color-brand;
						padding:0 10px;
						font-weight: bold;
						font-size: $text-size-md;
					}
				}
			}
			.order-address{
				width: 500px;
				margin:40px 0;
				
				.title{
					padding-bottom: 10px;
					border-bottom: 1px solid $text-color-four;
					p{
						font-size: $text-size-md;
					}
					@include flexBetweeCenter
				}
				.info{
					color: $text-color-two;
					.name{
						display: flex;
						margin-top: 15px;
						p{
							padding:0 20px 8px 0;
						}
					}
				}
				.order-set-address{
					margin-top: 10px;
					color: $text-color-one;
				}
			}
			.rules{
				width: 500px;
				margin:40px 0;
				.name{
					font-size: $text-size-md;
					padding-bottom: 10px;
					border-bottom: 1px solid $text-color-four;
				}
				.info{
					margin-top: 15px;
					color: $text-color-two;
					p{
						padding:0 0 8px 0;
					}
				}
			}
		}
	}
	.buy-box{
		color: $text-color-one;
		.buy-title{
			font-size: $text-size-md;
		}
		.buy-info{
			margin-top: 10px;
			.pay-info{
				padding:5px 0;
				span:last-child{
					padding-left:10px;
					color:$text-color-brand;
				}
			}
		}
		.btn{
			margin-top: 15px;
			.btn-paypal{
				padding:0 15px;
				@include buttonPayPal;
			}
		}
	}
</style>
