<template>
	<div>
		<div class="product-box">
			<div class="product-left">
				<div class="product-imgs">
					<div class="imgs-item">
						<el-image :src="skuInfo.showImg?skuInfo.showImg:imgShow" />
					</div>
				</div>
				<div class="share-icon">
					<ShareIcon />
				</div>
			</div>
			<div class="product-right">
				<div class="head">
					<div class="title">{{productData.ptitle}}</div>
					<div class="store">
						<i class="el-icon-s-shop"></i>
						<el-link :href="shopUrl" target="_blank">{{productData.pstorename}}</el-link>
					</div>
					<div class="price">
						 <!-- 判断是否处于拼单状态或者TOP20或者测评  0正常产品  1是Share Get 2是TOP20(弃用)  3是Free Get  4是拼团 -->
						<template v-if="productData.ifpd==0 || productData.ifpd==4">
							<div class="new">${{skuInfo.newPrice_pt}}</div>
							<div class="old">${{skuInfo.oldPrice}}</div>
						</template>
						<template v-if="productData.ifpd==1 || productData.ifpd==3">
							<div class="new">Free</div>
							<div class="old">${{skuInfo.newPrice_pt}}</div>
						</template>
					</div>
				</div>
				<div class="description" v-if="productData.pdesc!=''">
					<div class="title">Description</div>
					<div class="txt">{{productData.pdesc}}</div>
				</div>
				<div class="attr-box">
					<SKU :skuData="skudata" :skuInfo.sync="selectSku" />
					<div class="quality-box">
						<div class="name">Quality</div>
						<el-input-number v-model="num" :min="1" :max="skuInfo.stock" @change="_handQualityNum"></el-input-number>
					</div>
					<div class="shopping-box">
						<p>Shipping:</p>
						<span>Free Shipping to United States</span>
					</div>
				</div>
				<div class="btn-box">
					 <!-- 判断是否处于拼单状态或者TOP20或者测评  0正常产品  1是Share Get 2是TOP20(弃用)  3是Free Get  4是拼团 -->
					 <template v-if="productData.ifpd==0 || productData.ifpd==4">
						 <div class="btn btn-zu" @click="_handBuy(0)">
						 	<p>${{skuInfo.newPrice_pt}}</p>
						 	<p>Group Shopping</p>
						 </div>
						 <div class="btn btn-fu" @click="_handBuy(1)">
						 	<p>${{skuInfo.newPrice}}</p>
						 	<p>Buy Now</p>
						 </div>
						 <div class="love">
							  <i class="iconfont" :class="isFocus?'icon-like1':'icon-like'" @click="_handFocus"></i>
						 </div>
					 </template>
					 <template v-if="productData.ifpd==1 || productData.ifpd==3">						<div class="btn btn-zu" @click="_handBuy(2)">
						 	<p>$0.00</p>
						 	<p>{{productData.ifpd==1?'Share Get':'Free Get'}}</p>
						 </div>
					</template>
				</div>
				<template v-if="productData.ifpd==0 || productData.ifpd==4">
					<div class="product-stock">stock {{skuInfo.stock}} piece</div>
					<div class="group-buy">
						<img src="../../assets/image/groupbuy-img.jpg" alt="">
					</div>
				</template>
				<div class="pay-icon">
					<img src="../../assets/image/pay-icon.jpg" alt="">
				</div>
				<div class="buyer-protection">
					<div class="title">Buyer Protection</div>
					<div class="buyer-info">
						<div class="left">
							<p><span>Full Refund</span> if you don't receive your order.</p>
							<p><span>Full or Partial Refund</span> if the item is not as described.</p>
						</div>
						<div class="right">
							<!-- <el-link>Learn More</el-link> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {InputNumber,Link,Dialog,Tooltip} from 'element-ui'
	import PicZoom from "vue-piczoom"
	import groupShopping from "@/components/groupShopping"
	import ShareIcon from '@/components/ShareIcon'
	import {mapGetters,mapMutations} from 'vuex'
	import SKU from '@/components/SKU'
	export default({
		name:'ProductDetail',
		props:{
			pid:String
		},
		components:{
			[InputNumber.name]:InputNumber,
			[Dialog.name]:Dialog,
			[Link.name]:Link,
			[Tooltip.name]:Tooltip,
			PicZoom,
			groupShopping,
			ShareIcon,
			SKU
		},
		data(){
			return{
				title:'',
				productData:{},  //产品信息
				imgs:[],   //图片小图
				imgShow:'',  //显示的图片
				num:1,  //默认数量
				dialogGroup:false,
				isFocus:false,
				skudata:{},
				selectSku:{},
				btnload:true
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
					const productData=this.productData;
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
			shopUrl(){
				return `/shop/${this.productData.pstoreid}`
			},
			...mapGetters([
				'isLogin'
			])
		},
		created() {
			
			this.getProductDetail(this.pid);
			this.getSaleFocus(this.pid);
		},
		methods:{
			//获取详情信息
			getProductDetail(pid){
				
				this.$api.product.getSCProductInfo({pid}).then(res=>{
					console.log(res)
					if(Object.keys(res).length>0){
						window.document.title = res.ptitle;
						const pimg=res.pimg.split(',')
						this.imgsLg=pimg;
						this.imgs=res.psimg.split(',');
						this.imgShow=pimg[0]
						this.productData=res;
						if(res.psku==''){
							this.getAttr(pid)
						}
					}else{
						this.$message.warning('Data Loading Fail');
						setTimeout(()=>{
							this.$emit('closeDialog',false)
						},2000)
						 
					}
				}).catch(err=>{
					this.$emit('closeDialog',false)
				})
			},
			//获取属性
			getAttr(pid){
				this.$api.product.getSCProductColumnsSKU({pid,ifpd:0}).then(res=>{
					if(res!=''){
						this.skudata=res
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			//获取是否关注
			getSaleFocus(pid){
				this.$api.product.getSaleFocus({pid}).then(res=>{
					this.isFocus=res==0?false:true
				})
			},
			//数量变化
			_handQualityNum(val){
				
			},
			//关注
			async _handFocus(){
				if(!this.isLogin){
					this.$emit('closeDialog',true)
					return;
				}
				let isFocus=this.isFocus;
				let res=''
				if(isFocus){
					res=await this.$api.product.cancelFocus({pid:this.pid});
				}else{
					res=await this.$api.product.focusProduct({pid:this.pid});
				}
				if(res>0){
					this.isFocus=!isFocus;
				}else{
					this.$message.warning('Fail');
				}
			},
			_handBuy(num){
				//num  0拼团  1正常购买  2 Share Get 3参与拼团
				if(!this.isLogin){
					this.$emit('closeDialog',true)
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
					return;
				}
				let {ptitle,minspjg,psku,kc}=this.productData;
				let selsku=Object.keys(checkSku).length>0?checkSku.sku:psku;
				if(num==2){
					 var zfinfos = 0.00 + "," + 0.00 + "," + 0 + "," + 0.00 + "," + 0.00 + "," + 0.00 + "," + 0.00 + "," + 0 + "," + 0.00 + "," + 0;
					 var zfobj = selsku + "|1|0|" + zfinfos + "|0|0|" + ""; //支付数据
					 this.$api.product.CommitPay_AD_PD({zfobj}).then(res=>{
						 console.log(res);
						 if(res.fsstate==0){
							this.$router.push({path:`/groupswait/${res.fsmes}`})
						 }
						this.btnload=true
					 }).catch(err=>{
						 this.btnload=true
					 })
				}else if(num==0){
					this.$router.push({path:'/payment',query:{sku:selsku,num:this.num,ispt:1}})
				}else if(num==1){
					let sku={
						pimg:this.imgsLg[0],
						num:this.num,
						ptitle:ptitle,
						price:Object.keys(checkSku).length>0?checkSku.price:minspjg,
						res_skuattrall:Object.keys(checkSku).length>0?checkSku.res_skuattrall:'',
						psku:selsku,
						kc:Object.keys(checkSku).length>0?checkSku.kc:kc,
					}
					this.addCart(sku);
					this.$router.push({path:'/payment',query:{sku:selsku,num:this.num,ispt:0}})
				}else if(num==3){
					this.$router.push({path:'/payment',query:{sku:selsku,num:this.num,ispt:1,ptorderno:orderno}})
				}
				
			},
			//登录得隐藏
			handleClose(){
				this.loginDialog=false
			},
			...mapMutations({
				addCart:'Cart/SETCART'
			})
		},
		watch:{
			pid(val){
				if(val!=''){
					this.getProductDetail(val);
					this.getSaleFocus(val);
				}
				
			}
		}
	})
</script>

<style lang="scss" scoped>
	.product-box{
		margin:20px auto;
		display: flex;
		.product-left{
			width: 400px;
			.product-imgs{
				display: flex;
				align-items: flex-start;
				.imgs-list{
					width: 100px;
					.imgs-box{
						width: 50px;
						height: 50px;
						border:1px solid $text-color-three;
						cursor: pointer;
						margin-bottom: 20px;
						border-radius: $border-radius-xs;
						overflow: hidden;
					}
				}
				.imgs-item{
					width: 360px;
					el-image{
						width: 360px;
						height: 360px;
					}
				}
			}
			.share-icon{
				margin-top: 30px;
			}
		}
		.product-right{
			flex: 1;
			margin-left: 30px;
			.head{
				.store{
					color:$text-color-brand-fu;
					margin:10px 0;
					display: flex;
					align-items: center;
				}
				.price{
					.new{
						font-size: $text-size-lg;
						color:$text-color-brand;
					}
					.old{
						margin-top: 8px;
						@include strikethrough;
						
					}
				}
			}
			.attr-box{
				margin:40px 0 20px;
				.attr-node{
					margin:20px 0;
					display: flex;
					flex-direction: column;
					.attr-node-item{
						margin-top: 15px;
						display: flex;
						flex-wrap: wrap;
						.attr-item{
							margin: 0 15px 15px 0;
							cursor: pointer;
							p{
								padding: 5px 12px;
								border: 1px solid $text-color-four;
								border-radius: $border-radius-sm;
							}
							.el-img{
								border: 1px solid $text-color-four;
								border-radius: $border-radius-sm;
							}
							.active{
								border: 2px solid $text-color-brand;
							}
							.disabled {
								cursor: default;
								color: $text-color-two;
								background-color:#f7f7f7;
								opacity: .5;
							}
						}
					}
				}
				.quality-box{
					.name{
						margin-bottom: 15px;
					}
				}
				.shopping-box{
					margin-top: 20px;
					span{
						display: block;
						padding-top: 10px;
						color: $text-color-two;
						font-weight: bold;
					}
				}
			}
			.btn-box{
				margin-top: 40px;
				display: flex;
				align-items: center;
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
				.btn-fu{
					@include  buttonBrandfu;
				}
				.love{
					width: 70px;
					margin-top: 8px;
					text-align: center;
					cursor: pointer;
					i{
						font-size: $text-size-3x;
						color: $text-color-three;
					}
					.icon-like1{
						color:$text-color-brand;
					}
				}
			}
			.product-stock{
				margin-top: 5px;
				color: $text-color-one;
			}
			.group-buy{
				margin:10px 0;
				cursor: pointer;
			}
			.pay-icon{
				margin-top: 20px;
				img{
					width: 300px;
				}
			}
			.buyer-protection{
				margin:10px 0;
				.title{
					font-size: $text-size-lg;
					color:skyblue;
				}
				.buyer-info{
					margin-top: 10px;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					p{
						padding:4px 0;
						span{
							font-weight: bold;
						}
					}
				}
			}
		}
	}
	.more-love{
		width: 100%;
		max-width: $doc-width;
		margin: 0 auto;
	}
</style>
