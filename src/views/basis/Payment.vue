<template>
	<div>
		<Header />
		<div class="coninter payment-box">
			<div class="order-address" v-if="computeMoney==0">
				<div class="name">Shpping Address <i class="el-icon-edit" @click="_handSetAddress(1)"></i></div>
				<div class="address-box">
					<template v-if="address.name!=''">
						<div class="head">
							<span class="pname">{{address.name}}</span>
							<span class="phone">{{address.phone}}</span>
						</div>
						<div class="desc">{{address.txt}}</div>
					</template>
					<template v-else>
						<div class="add-address">
							<el-button type="primary" @click="_handSetAddress(0)">Add Address</el-button>
						</div>
					</template>
				</div>
			</div>
			<div class="order-info">
				<div class="name">Order Reivew</div>
				<div class="order-box">
					<div class="order-item" v-for="(item,index) in saleList" :key="index">
						<div class="img-box">
							<el-image class="img" :src="item.pimg" fit="scale-down"></el-image>
						</div>
						<div class="info">
							<div class="title item">{{item.sptitle}}</div>
							<div class="price item">${{item.spdj}}</div>
							<div class="footer item">
								<div class="attr">{{item.skuattr}}</div>
								<div class="num">x{{item.gmNum}}</div>
							</div>
						</div>
					</div>
					<div class="remark-box">
						<el-input type="textarea" placeholder="Enter remark" v-model="remarkval" show-word-limit>
						</el-input>
					</div>
				</div>
			</div>
			<div class="order-pay">
				<div class="name">Order Summary</div>
				<div class="order-pay-box">
					<div class="order-pay-node">
						<div class="item">
							<div class="txt">Product Total:</div>
							<div class="num">${{totalPrice}}</div>
						</div>
						<div class="item" v-if="income>0">
							<div class="txt">Income:</div>
							<div class="num">${{income}}</div>
						</div>
						<div class="item" v-if="coupon.isShow" @click="_hankCoupon" style="cursor: pointer;">
							<div class="txt">Coupon:</div>
							<div class="num" :class="coupon.money==0?'num-no':''">
								{{coupon.money==0?'Select':'$'+coupon.money}}
							</div>
						</div>
						<div class="item" v-if="integral>0">
							<div class="txt">Integral Exchange:</div>
							<div class="num">${{integral}}</div>
						</div>
						<div class="item" v-if="balancePayMoney>0">
							<div class="txt">Balance Payment:</div>
							<div class="num">${{balancePayMoney}}</div>
						</div>
						<div class="item" v-if="computeMoney>0">
							<div class="txt">Pay Extra:</div>
							<div class="num">${{computeMoney}}</div>
						</div>
						<div class="btn-pay">
							<button class="btn btn-paypal" :loading="disabled" v-if="computeMoney>0"
								@click="paySubmit">PayPal Pay</button>
							<el-button class="btn" type="primary" :loading="disabled" v-if="computeMoney==0"
								@click="paySubmit">Pay</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Footer />
		<el-dialog title="Address" :visible.sync="addVisible" width="700px" :before-close="handleAddressClose">
			<AddressItem :addressId="addressId" @updateAddress="handleAddressClose" />
		</el-dialog>

		<el-dialog title="Select Coupon" :visible.sync="couponVisible" width="400px" :before-close="handleCouponClose">
			<div class="coupon">
				<CouponItem v-for="(item,index) in Couponlist" :key="index" :couponData="item"
					@click="_handCoupon(item)" />
				<div class="coupon-btn">
					<el-button type="danger" plain @click="_handNotCoupon">Do not use coupons</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		Input,
		Dialog
	} from 'element-ui'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		cmdEncrypt
	} from "@/assets/js/RSAz.js"
	export default ({
		name: 'Payment',
		components: {
			[Input.name]: Input,
			[Dialog.name]: Dialog,
			AddressItem: () => import('@/components/AddressItem'),
			CouponItem: () => import('@/components/CouponItem')
		},
		data() {
			return {
				skus: '',
				saleList: [],
				remarkval: '',
				income: 0, //收入支付
				integral: 0, //积分支付
				balance: 0, //余额支付
				coupon: { //抵用券
					id: 0,
					money: 0,
					isShow: false //是否显示
				},
				address: {
					name: '',
					phone: '',
					txt: '',
					id: ''
				},
				addVisible: false,
				addressId: '',
				disabled: false,
				gmfs: '',
				ifsw: 0, //是否是实物
				couponVisible: false, //抵用券弹出框
				Couponlist: [], //全部抵用券,
				isDetail: false, //是否是详情页直接过来支付的
				num: 1, //详情页过来购买的数量，默认1
				ispt: false, //是否拼团
				ptorderno: this.$route.query.ptorderno || ''
			}
		},
		computed: {
			...mapGetters([
				'cart'
			]),
			//计算商品总价
			totalPrice() {
				let saleList = this.saleList;
				let num = 0
				saleList.forEach(n => {
					num += n.gmNum * n.spdj;
				})
				return num
			},
			//计算余额支付
			balancePayMoney() {

				if (Number(this.income) + Number(this.coupon.money) >= this.totalPrice) {
					if (this.coupon.money == 0) {
						return this.totalPrice
					} else {
						return (Number(this.totalPrice) - Number(this.coupon.money)).toFixed(2)
					}
				} else {
					return this.income
				}
				return (Number(this.totalPrice) - Number(this.coupon.money) - Number(this.income) - Number(this
					.integral) - Number(this.balance)).toFixed(2);
			},
			//计算剩余支付
			computeMoney() {
				if (this.balancePayMoney == this.totalPrice) {
					return 0;
				} else {
					if (this.coupon.money > 0) {
						return (Number(this.totalPrice) - Number(this.balancePayMoney) - Number(this.coupon.money))
							.toFixed(2);
					} else {
						return (Number(this.totalPrice) - Number(this.balancePayMoney)).toFixed(2);
					}

				}
			},
		},
		created() {
			let skus = '';
			const {
				num,
				sku,
				ispt
			} = this.$route.query;
			if (num && sku) { //是否详情页跳转过来
				skus = ispt == 1 ? sku : `'${sku}'`
				// skus=`'${sku}'`
				this.isDetail = true
				this.num = num;
			} else {
				this.cart.forEach(n => {
					skus += "'" + n.psku + "',";
				})
				skus = skus.substring(0, skus.length - 1);
				this.isDetail = false
			}
			this.ispt = ispt && ispt == 1 ? true : false
			this.skus = skus;
			this.getSaleList(skus);
		},
		methods: {
			//获取商品信息
			async getSaleList(skus) {
				if (this.saleList.length == 0) {
					this.$loading.load();
				}
				const urlname = this.ispt ? 'Get_MyCarSCProductsSaleList_PT' : 'Get_MyCarSCProductsSaleList'
				const res = await this.$api.product[urlname]({
					skus
				});
				let rows = res.rows;
				if (this.saleList.length == 0) { //第一次加载
					if (rows.length > 0) {
						rows.forEach(n => {
							if (this.isDetail) {
								n.gmNum = this.num
							} else {
								this.cart.forEach(m => {
									if (n.sku == m.psku) {
										if (m.num > n.cangmnum) {
											m.num = n.cangmnum
											n.gmNum = n.cangmnum //自己添加得字段，购买数量，如果大于库存，就等于库存
											m.addCart = true; //添加购物车添加数量变化得标识

											//库存有变化直接更新购物车
											if (m.num != 0) {
												this.addCart(m)
											} else {
												this.removeCrat(m.psku)
											}
										} else {
											n.gmNum = m.num //自己添加得字段，购买数量
										}
									}
								})
							}

						});
						this.saleList = rows;
						this.getCoupu()
					} else {
						this.$router.push({
							path: '/cart'
						})
					}
					this.$loading.unLoad();
				} else { //结算加载
					this.gmfs = ''
					rows.forEach(item => {
						if (this.isDetail) {
							this.gmfs = this.num;
						} else {
							this.cart.forEach(n => {
								if (item.sku == n.psku) {
									if (item.cangmnum < n.num) {
										this.$message.success(
											'Some of the information you have purchased has changed!'
										)
										this.disabled = false
										return;
									}
									this.gmfs += n.num + ',';
								}
							})
						}
					})
					if (this.disabled) {
						this.paysubmit2();
					}
				}
			},
			//获取抵用券
			getCoupu() {
				let params = {
					orderTotalMoney: this.totalPrice,
					HzPID: '',
					SkuID: '',
					ifJustRight: 0
				}
				this.$api.product.getMaxVoucher(params).then(res => {
					//console.log(res);
					if (res != '') {
						this.income = res.ye
						this.integral = res.jf
						if (res.vid != 0) {
							this.coupon = Object.assign({}, this.coupon, {
								isShow: true,
								id: res.vid,
								money: res.vprice
							})
						}
					}
					this.computeMoney()
				}).catch(xhr => {

				})
			},
			//获取全部待使用抵用券
			getCouponAll() {
				this.$api.user.getVoucher({
					vtype: 0,
					pageindex: 0
				}).then(res => {
					if (res != '') {
						this.Couponlist = res.rows
					}
				})
			},
			//获取地址
			getAddress(addressid = '') {
				this.$api.product.GetAddressByAddressID({
					addressid
				}).then(res => {
					if (res.addressid != 0) {
						this.address = {
							name: res.firstname + ' ' + res.lastname,
							phone: res.lxfs,
							txt: res.address + " " + res.city + " " + res.province + " " + res.county,
							id: res.addressid
						}
					}
				}).catch(xhr => {

				})
			},
			//点击支付
			paySubmit() {
				this.disabled = true;
				this.getSaleList(this.skus)
			},
			//支付
			async paysubmit2() {
				let zffs = 0
				let ifwx = 0 //微信环境1  非微信0
				if (this.computeMoney > 0) { //paypal
					zffs = 2;
					this.address.id=0;
				} else { //余额
					if (this.address.id == '0') {
						if (this.ifsw == 1) {
							this.$message.warning('Please Set Shipping Address.')
							return;
						}
					}
					zffs = 1;
				}
				let gmfs = this.gmfs;
				
				gmfs = gmfs.includes(',') ? gmfs.substring(0, this.gmfs.length - 1) : gmfs
				//总共需支付金额,抵用券金额,抵用券ID,积分抵扣积分数,积分抵扣金额,余额支付金额,第三方支付金额,是否快递,运费
				let zfinfos = this.totalPrice.toFixed(2) + "," + this.coupon.money + "," + this.coupon.id + "," +
					this.integral + "," + this.integral / 100 + "," + this.balancePayMoney + "," + this
					.computeMoney + ",0,0,0";
				//sku 购买数量 支付方式
				let zfobj = this.skus + "|" + gmfs + "|" + zffs + "|" + zfinfos + "|" + this.ifsw + "|" + this
					.address.id + "|" + this.remarkval; //支付数据
				let zfobj1 = '',
					zfobj2 = "";
				//加密
				let res = await this.$api.verify.CreateRSAKey();
				if (res != null && res != '') {
					if (res.rescode == 0) {
						if (zfobj.length > 117) {
							zfobj1 = zfobj.substring(0, 117);
							zfobj2 = zfobj.substring(117);
							zfobj1 = cmdEncrypt(zfobj1, res.strPublicKeyExponent, res.strPublicKeyModulus, 1);
							zfobj2 = cmdEncrypt(zfobj2, res.strPublicKeyExponent, res.strPublicKeyModulus, 1);
						} else {
							zfobj1 = cmdEncrypt(zfobj, res.strPublicKeyExponent, res.strPublicKeyModulus, 1);
						}
					} else {
						this.$message.warning('Failed to create encrypted data. Please try again.');
						this.disabled = false;
						return;
					}
				} else {
					this.$message.warning('Failed to create encrypted data. Please try again.');
					this.disabled = false;
					return;
				}
				const params = {
					zfobj1,
					zfobj2,
					ifwx,
					ifanonymous: 0,
					password: '',
					mwpassword: '',
					qdbs: ''
				}

				//支付
				if (this.ispt) {
					Object.assign(params, {
						ptorderno: this.ptorderno
					})
					var resjson = await this.$api.product.CommitPay_PT(params)
				} else { //正常购买支付
					var resjson = await this.$api.product.CommitPay_SC(params)
				}
				if (resjson != null && resjson != '') {
					if (resjson.fsstate != 0) {
						this.$message.warning(resjson.fsmes);
						if (resjson.fsstate == 2) { //登录超时
							this.$router.push({
								path: '/login',
								query: {
									tofrom: this.$route.path
								}
							})
						}
						if (resjson.fsstate == 3) { //抵用券没办法用，还原
							this.coupon.money = 0
							this.coupon.id = ''
						}
					} else {
						let sku = this.skus.split(',');
						sku.forEach(n => {
							this.removeCrat(n.substring(1,n.length-1))
						})
						if (resjson.fzffs == 0) { //余额支付
							if (this.ispt) {
								this.$router.push({
									path: `/groupswaitbuy/${resjson.fsmes}`
								});
							} else {
								this.$router.push({
									path: '/paymentsuccessful'
								});
							}

						} else if (resjson.fzffs == 2) { //PayPal支付
							window.location.href = resjson.fsmes;
						} else {
							//微信支付
						}
					}
					this.disabled = false;
				} else {
					this.$message.warning('Failed to create encrypted data. Please try again.');
					this.disabled = false;
					return;
				}
			},
			//更新关闭地址
			_handSetAddress(num) {
				if (num == 1) {
					this.addressId = this.address.id + ''
				} else {
					this.addressId = '';
				}
				this.addVisible = true;
			},
			//关闭地址弹框，istype判断是否更新地址
			handleAddressClose(istype = false) {
				this.addVisible = false;
				if (istype) {
					this.getAddress(this.addressId);
				}
			},
			//抵用券选择框弹出
			_hankCoupon() {
				if (this.Couponlist.length == 0) {
					this.getCouponAll();
				}
				this.couponVisible = true
			},
			//选择抵用券
			_handCoupon(item) {
				this.coupon = Object.assign({}, this.coupon, {
					id: item.vid,
					money: item.vprice
				})

				this.couponVisible = false
			},
			//不使用抵用券
			_handNotCoupon() {
				this.coupon = Object.assign({}, this.coupon, {
					id: 0,
					money: 0
				})
				this.couponVisible = false
			},
			//关闭抵用券
			handleCouponClose() {
				this.couponVisible = false
			},
			...mapMutations({
				addCart: 'Cart/SETCART',
				removeCrat: 'Cart/DELCART',
			})
		},
		watch: {
			cart(newVal) {
				let skus = '';
				newVal.forEach(n => {
					skus += "'" + n.psku + "',";
				})
				skus = skus.substring(0, skus.length - 1);
				this.skus = skus;
			},
			computeMoney(n) {
				if (n <= 0 && this.address.name == '') {
					this.getAddress()
				}
			}
		}
	})
</script>

<style lang="scss" scoped>
	.payment-box {
		max-width: 800px;
		margin: 20px auto;
		background-color: #fff;
		border-radius: $border-radius-md;
		padding: 20px;
		flex-direction: column;

		.order-address {
			margin-bottom: 30px;

			.name {
				font-size: $text-size-md;
				padding-bottom: 10px;
				border-bottom: 1px solid #f7f7f7;

				i {
					cursor: pointer;
				}
			}

			.address-box {
				margin: 20px 0;

				.head {
					span {
						padding-right: 20px;
					}
				}

				.desc {
					margin-top: 10px;
					color: $text-color-three;
				}
			}
		}

		.order-info {
			margin-bottom: 30px;

			.name {
				font-size: $text-size-md;
				padding-bottom: 10px;
				border-bottom: 1px solid #f7f7f7;
			}

			.order-box {
				.order-item {
					margin: 20px 0;
					display: flex;

					.img {
						width: 100px;
						height: 100px;
					}

					.item {
						margin-bottom: 8px;
					}

					.info {
						flex: 1;
						padding-left: 20px;
						display: flex;
						flex-direction: column;

						.price {
							color: $text-color-brand;
							font-weight: bold;
						}

						.footer {
							@include flexBetweeCenter color: $text-color-three;
						}
					}
				}

				.remark-box {
					margin: 20px 0;
				}
			}
		}

		.order-pay {

			.name {
				font-size: $text-size-md;
				padding-bottom: 10px;
				border-bottom: 1px solid #f7f7f7;
			}

			.order-pay-box {
				margin-top: 20px;
				display: flex;
				justify-content: flex-end;

				.order-pay-node {
					width: 400px;

					.item {
						display: flex;
						justify-content: space-between;
						padding: 5px 0;

						.num {
							font-weight: bold;
							color: $text-color-brand;
						}

						.num-no {
							font-weight: normal;
						}
					}

					.btn-pay {
						.btn {
							width: 100%;
							margin-top: 10px;
						}

						.btn-paypal {
							@include buttonPayPal;
						}
					}
				}
			}

		}
	}

	.coupon {
		width: 100%;
		margin: auto;

		.coupon-btn {
			text-align: center;
			margin-top: 20px;
		}
	}
</style>
