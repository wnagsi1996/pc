<template>
	<div v-title="productData.ptitle">
		<Header ref="header" />
		<div class="product-box">
			<div class="product-left">
				<div class="product-imgs">
					<div class="imgs-list">
						<div class="imgs-box" v-for="(item,index) in imgs" :key="index">
							<el-image :src="item" fit="scale-down" style="width: 50px;height: 50px;"
								@mouseenter="_handMouseImg(index)" />
						</div>
					</div>
					<div class="imgs-item">
						<pic-zoom :url="skuInfo.showImg?skuInfo.showImg:imgShow" :scale="3"></pic-zoom>
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
						<el-input-number v-model="num" :min="1" :max="skuInfo.stock" @change="_handQualityNum">
						</el-input-number>
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
					<template v-if="productData.ifpd==1 || productData.ifpd==3">
						<div class="btn btn-zu" @click="_handBuy(2)">
							<p>$0.00</p>
							<p>{{productData.ifpd==1?'Share Get':'Free Get'}}</p>
						</div>
					</template>
				</div>
				<div class="product-stock">stock {{skuInfo.stock}} piece</div>
				<!-- 拼团 -->
				<template v-if="Object.keys(ptInfo).length>0">
					<div v-for="(item,index) in ptInfo" :key="index" class="group-buy-box">
						<comment :is="GroupShoppingNode" :infoData="item" @finish="getSCPTOrderInfo"
							@jonNow="_handBuy(3,item.orderno)"></comment>
					</div>
				</template>
				<template v-if="productData.ifpd==0 || productData.ifpd==4">
					<div class="group-buy" @click="_handShowGroup">
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
				<div>
					<el-button plain @click="_handShowDetail">View Detail</el-button>
				</div>
			</div>
		</div>
		<div class="coninter" style="margin:50px auto;max-width: 800px;" v-show="showDetailInfo" v-html="detailInfo">
		</div>
		<div class="more-love">
			<moreLove :list="list" />
		</div>
		<Footer />
		<!-- 规则 -->
		<el-dialog :visible.sync="dialogGroup" width="600px" :before-close="handleCloseGroup">
			<groupShopping />
		</el-dialog>
	</div>
</template>

<script>
	import {
		InputNumber,
		Link,
		Dialog,
		Tooltip
	} from 'element-ui'
	import PicZoom from "vue-piczoom"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default ({
		name: 'ProductDetail',
		components: {
			[InputNumber.name]: InputNumber,
			[Dialog.name]: Dialog,
			[Link.name]: Link,
			[Tooltip.name]: Tooltip,
			PicZoom,
			groupShopping: () => import('@/components/groupShopping'),
			moreLove: () => import('@/components/MoreLove'),
			ShareIcon: () => import('@/components/ShareIcon'),
			SKU: () => import('@/components/SKU'),
			GroupShoppingNode: () => import('@/components/GroupShoppingNode')
		},
		data() {
			return {
				pid: '',
				title: '',
				productData: {}, //产品信息
				imgs: [], //图片小图
				imgsLg: [], //图片大图
				imgShow: '', //显示的图片
				num: 1, //默认数量
				dialogGroup: false,
				list: [],
				isFocus: false,
				skudata: {},
				selectSku: {},
				ptInfo: {}, //拼团信息
				btnload: true,
				detailInfo: '', //详情
				showDetailInfo: false
			}
		},
		beforeRouteEnter(to, from, next) {
			let {
				pid
			} = to.query;
			if (pid != '') {
				next()
			} else {
				next('/productlist')
			}
		},
		beforeRouteUpdate(to, from, next) {
			let {
				pid
			} = to.query;
			this.pid = pid;
			this.getProductDetail(pid);
			this.getSaleFocus(pid);
			this.getMoreLove();
			next()
		},
		computed: {
			skuInfo() {
				const checkSku = this.selectSku;
				let obj = {}
				if (checkSku.sku) {
					obj = {
						oldPrice: checkSku.pscjg,
						newPrice_pt: checkSku.price_pt ? checkSku.price_pt : checkSku.price,
						newPrice: checkSku.price,
						stock: Number(checkSku.kc)
					}
				} else {
					let productData = this.productData;
					obj = {
						oldPrice: productData.showpscjg,
						newPrice_pt: productData.showspjg_pt ? productData.showspjg_pt : productData.showspjg,
						newPrice: productData.showspjg,
						stock: Number(productData.pkc)
					}
				}
				obj.showImg = checkSku.showImg ? checkSku.showImg : ''
				return obj;
			},
			shopUrl() {
				return `/shop/${this.productData.pstoreid}`
			},
			...mapGetters([
				'isLogin'
			])
		},
		created() {
			let {
				pid
			} = this.$route.query;
			this.pid = pid;
			this.getProductDetail(pid);
			this.getSaleFocus(pid);
			this.getMoreLove();
			this.getSCPTOrderInfo();
		},
		methods: {
			//获取详情信息
			async getProductDetail(pid) {
				this.$loading.load()
				const res = await this.$api.product.getSCProductInfo({
					pid
				})
				this.$loading.unLoad()
				if (Object.keys(res).length > 0) {
					let pimg = res.pimg.split(',')
					this.imgsLg = pimg;
					this.imgs = res.psimg.split(',');
					this.imgShow = pimg[0]
					this.productData = res;
					if (res.psku == '') {
						this.getAttr(pid)
					}
				} else {
					if (window.history.length > 1) {
						this.$router.go(-1);
					} else {
						this.$message.warning({
							message: 'Loading Fail',
							duration: 2000
						})
						setTimeout(() => {
							this.$router.push('/productlist')
						}, 2000)

					}
				}
			},
			//获取商品详情
			async getNewsContent() {
				const res = await this.$api.product.getNewsContent({
					newid: this.productData.pid
				});
				console.log(res)
				if (res.rescode == 0) {
					let txt = res.fsmes;
					txt = txt.replace(/~\|~/g, '[').replace(/~\|\|~/g, ']').replace(/~\^~/g, '{').replace(
							/~\^\^~/g, '}').replace(/~rn~/g, '\r\n')
						.replace(/~n~/g, '\n').replace(/~r~/g, '\r').replace(/~t~/g, '\t').replace(/~\\~/g, '\\');
					this.detailInfo = txt;
				}
			},
			//获取拼团信息
			async getSCPTOrderInfo() {
				const res = await this.$api.product.getSCPTOrderInfo({
					pid: this.pid
				});
				if (res.rows.length > 0) {
					this.ptInfo = res.rows;
				}
			},
			//获取属性
			getAttr(pid) {
				this.$loading.load()
				this.$api.product.getSCProductColumnsSKU({
					pid,
					ifpd: 0
				}).then(res => {
					this.$loading.unLoad()
					if (res != '') {
						this.skudata = res
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取是否关注
			getSaleFocus(pid) {
				this.$api.product.getSaleFocus({
					pid
				}).then(res => {
					this.isFocus = res == 0 ? false : true
				})
			},
			//鼠标滑过图片变化
			_handMouseImg(index) {
				this.imgShow = this.imgsLg[index];
			},
			//数量变化
			_handQualityNum(val) {

			},

			//获取推荐产品
			getMoreLove() {
				this.$api.product.getTopProductList({
					pid: this.pid
				}).then(res => {
					console.log(res)
					if (res.rows != '' && res.rows.length > 0) {
						this.list = res.rows;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//关注
			async _handFocus() {
				if (!this.isLogin) {
					this.$refs.header.showLogin()
					return;
				}
				let isFocus = this.isFocus;
				let res = ''
				if (isFocus) {
					res = await this.$api.product.cancelFocus({
						pid: this.pid
					});
				} else {
					res = await this.$api.product.focusProduct({
						pid: this.pid
					});
				}
				if (res > 0) {
					this.isFocus = !isFocus;
				} else {
					this.$message.warning('Fail');
				}
			},
			//显示规则
			_handShowGroup() {
				this.dialogGroup = true;
			},
			//隐藏规则
			handleCloseGroup() {
				this.dialogGroup = false;
			},
			_handBuy(num, orderno = '') {
				//num  0拼团  1正常购买  2 Share Get 3参与拼团

				if (!this.isLogin) {
					this.$refs.header.showLogin()
					return;
				}
				if (this.btnload) {
					this.btnload = false
				} else {
					return;
				}
				let checkSku = this.selectSku;
				let productData = this.productData;
				if (Object.keys(checkSku).length == 0 && productData.psku == '') {
					this.$message.warning('Select product attributes');
					this.btnload = true
					return;
				}
				let {
					ptitle,
					minspjg,
					psku,
					kc
				} = this.productData;
				let selsku = Object.keys(checkSku).length > 0 ? checkSku.sku : psku;
				if (num == 2) {
					var zfinfos = 0.00 + "," + 0.00 + "," + 0 + "," + 0.00 + "," + 0.00 + "," + 0.00 + "," + 0.00 +
						"," + 0 + "," + 0.00 + "," + 0;
					var zfobj = selsku + "|1|0|" + zfinfos + "|0|0|" + ""; //支付数据
					this.$api.product.CommitPay_AD_PD({
						zfobj
					}).then(res => {
						console.log(res);
						if (res.fsstate == 0) {
							this.$router.push({
								path: `/groupswait/${res.fsmes}`
							})
						}
						this.btnload = true
					}).catch(err => {
						this.btnload = true
					})
				} else if (num == 0) {
					this.$router.push({
						path: '/payment',
						query: {
							sku: selsku,
							num: this.num,
							ispt: 1
						}
					})
				} else if (num == 1) {
					let sku = {
						pimg: this.imgsLg[0],
						num: this.num,
						ptitle: ptitle,
						price: Object.keys(checkSku).length > 0 ? checkSku.price : minspjg,
						res_skuattrall: Object.keys(checkSku).length > 0 ? checkSku.res_skuattrall : '',
						psku: selsku,
						kc: Object.keys(checkSku).length > 0 ? checkSku.kc : kc,
					}
					this.addCart(sku);
					this.$router.push({
						path: '/payment',
						query: {
							sku: selsku,
							num: this.num,
							ispt: 0
						}
					})
				} else if (num == 3) {
					this.$router.push({
						path: '/payment',
						query: {
							sku: selsku,
							num: this.num,
							ispt: 1,
							ptorderno: orderno
						}
					})
				}

			},
			//显示详情
			_handShowDetail() {
				this.showDetailInfo = !this.showDetailInfo;
				if (this.detailInfo == '') {
					this.getNewsContent()
				}
			},
			...mapMutations({
				addCart: 'Cart/SETCART'
			})
		}
	})

	function reg(str) {
		return new RegExp(str, 'gm')
	}
</script>

<style lang="scss" scoped>
	.product-box {
		width: 100%;
		max-width: $doc-width;
		margin: 20px auto;
		display: flex;

		.product-left {
			width: 650px;

			.product-imgs {
				display: flex;
				align-items: flex-start;

				.imgs-list {
					width: 100px;

					.imgs-box {
						width: 50px;
						height: 50px;
						border: 1px solid $text-color-three;
						cursor: pointer;
						margin-bottom: 20px;
						border-radius: $border-radius-xs;
						overflow: hidden;
					}
				}

				.imgs-item {
					width: 500px;
				}
			}

			.share-icon {
				margin-top: 30px;
				padding-left: 90px;
			}
		}

		.product-right {
			flex: 1;

			.head {
				.store {
					color: $text-color-brand-fu;
					margin: 10px 0;
					display: flex;
					align-items: center;
				}

				.price {
					.new {
						font-size: $text-size-lg;
						color: $text-color-brand;
					}

					.old {
						margin-top: 8px;
						@include strikethrough;

					}
				}
			}

			.attr-box {
				margin: 40px 0 20px;

				.attr-node {
					margin: 20px 0;
					display: flex;
					flex-direction: column;

					.attr-node-item {
						margin-top: 15px;
						display: flex;
						flex-wrap: wrap;

						.attr-item {
							margin: 0 15px 15px 0;
							cursor: pointer;

							p {
								padding: 5px 12px;
								border: 1px solid $text-color-four;
								border-radius: $border-radius-sm;
							}

							.el-img {
								border: 1px solid $text-color-four;
								border-radius: $border-radius-sm;
							}

							.active {
								border: 2px solid $text-color-brand;
							}

							.disabled {
								cursor: default;
								color: $text-color-two;
								background-color: #f7f7f7;
								opacity: .5;
							}
						}
					}
				}

				.quality-box {
					.name {
						margin-bottom: 15px;
					}
				}

				.shopping-box {
					margin-top: 20px;

					span {
						display: block;
						padding-top: 10px;
						color: $text-color-two;
						font-weight: bold;
					}
				}
			}

			.btn-box {
				margin-top: 40px;
				display: flex;
				align-items: center;

				.btn {
					width: 180px;
					height: 40px;
					line-height: 24px;
					padding: 10px 0 18px 0;
					margin: 0 10px 0 0;
				}

				.btn-zu {
					@include buttonBrand;
				}

				.btn-fu {
					@include buttonBrandfu;
				}

				.love {
					width: 70px;
					margin-top: 8px;
					text-align: center;
					cursor: pointer;

					i {
						font-size: $text-size-3x;
						color: $text-color-three;
					}

					.icon-like1 {
						color: $text-color-brand;
					}
				}
			}

			.product-stock {
				margin-top: 5px;
				color: $text-color-one;
			}

			.group-buy {
				margin: 10px 0;
				cursor: pointer;
			}

			.group-buy-box {
				width: 550px;
			}

			.pay-icon {
				margin-top: 20px;

				img {
					width: 300px;
				}
			}

			.buyer-protection {
				margin: 10px 0;

				.title {
					font-size: $text-size-lg;
					color: skyblue;
				}

				.buyer-info {
					margin-top: 10px;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;

					p {
						padding: 4px 0;
						span {
							font-weight: bold;
						}
					}
				}
			}
		}
	}
	.more-love {
		width: 100%;
		max-width: $doc-width;
		margin: 0 auto;
	}
</style>
