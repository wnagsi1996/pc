<template>
	<div ref="header" class="header">
		<div class="header-fixed">
			<div class="header-fixed-box">
				<div class="left">
					<div class="user-login" v-if="userInfo.loginname">Hi {{userInfo.ncname}}</div>
					<div class="user-login" v-else>Hi <a @click="showLogin">Login</a> or <a
							href="/register">Register</a></div>
					<div class="deals">
						<router-link to="/dealslist">Deals</router-link>
					</div>
				</div>
				<div class="right">
					<div class="my" :class="showUserInfo?'active':''">
						<span ref="myInfo" @mouseover="handMouseover" @mouseleave="mouseleave">My iSHARE</span>
						<div class="my-box" ref="myBox" v-show="showUserInfo" @mouseover="handMouseover1"
							@mouseleave="mouseleave1">
							<p></p>
							<div class="login-reg" v-if="userInfo.loginname">
								<div class="header-user">
									<img :src="userInfo.userimg" alt="">
									<div class="header-info">
										<p>{{userInfo.ncname}}</p>
										<span>{{userInfo.loginname}}</span>
									</div>
								</div>
							</div>
							<div class="login-reg" v-else>
								<button @click="showLogin">Login</button>
								<p>OR</p>
								<button>Register</button>
							</div>
							<div class="menu-link">
								<div class="menu-item">
									<router-link to="/usercenter">My Account</router-link>
								</div>
								<div class="menu-item">
									<router-link to="/myorder">My Order</router-link>
								</div>
								<div class="menu-item">
									<router-link to="/mygifts">My Gifts</router-link>
								</div>
								<div class="menu-item">
									<router-link to="/mymembers">My Member</router-link>
								</div>
								<div class="menu-item" @click="_handSingout">
									<a href="javascript:">Logout</a>
								</div>
							</div>
						</div>
					</div>
					<div class="cart">
						<router-link to="/cart">
							<i class="el-icon-shopping-cart-full"></i><em v-if="cartNum!=0">{{cartNum}}</em>
						</router-link>
					</div>
					<div class="wish">
						<router-link to="/mylike">
							<i class="el-icon-shopping-bag-1"></i><span>Wish List</span>
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<div class="header-box">
			<div class="header-node">
				<div class="content-box">
					<div class="logo">
						<img src="../../assets/image/logo.png" alt="logo" @click="_handToUrl" />
					</div>
					<div class="menu">
						<div class="menu-item" @click="categoryShow=true">
							<span class="txt">Category Classification</span>
							<i class="el-icon-caret-bottom"></i>
						</div>
						<div class="menu-box" v-show="categoryShow" @mouseleave="categoryShow=false">
							<div class="left">
								<div class="left-item" @mousemove="_handMenuMouseMove(item.id)" v-for="item in category"
									:key="item.id" @click="_handMenu(item.id)">{{item.name}}</div>
							</div>
							<div class="right">
								<div class="right-item" v-for="item in categoryChildren.children" :key="item.id"
									@click="_handMenu(item.id)">{{item.name}}</div>
							</div>
						</div>
					</div>
					<div class="search">
						<el-input class="search-inp" type="text" v-model="searchVal" @change="search" />
						<button class="search-btn" @click="search">Search</button>
					</div>
				</div>
				<div class="nav-box">
					<ul>
						<li>
							<router-link to="/">Home</router-link>
						</li>
						<li>
							<router-link to="/productlist">Mall products</router-link>
						</li>
						<li>
							<router-link to="/dealslist">Deals products</router-link>
						</li>
						<li>
							<router-link to="/freelist">Free Gifts</router-link>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 登录弹出 -->
		<el-dialog :visible.sync="loginDialog" width="400px" :before-close="handleClose" :close-on-click-modal="false">
			<mini-login @closeDialog="handleClose" />
		</el-dialog>

		<!-- 右边固定图标 -->
		<div class="icon-right">
			<ul>
				<li @click="_handToURL">
					<i class="el-icon-help"></i>
					<p>How To Get Free Gifts</p>
				</li>
				<li>
					<i class="el-icon-picture-outline"></i>
					<div class="qr-box">
						<span>WeChat Subscription</span>
						<el-image lazy class="img" :src="qrimg"></el-image>
					</div>
				</li>
				<li>
					<i class="el-icon-share"></i>
					<div class="share-box">
						<div class="item-icon" @click="_handShare('Facebook')">
							<el-image lazy class="img" :src="share.fb"></el-image>
						</div>
						<div class="item-icon" @click="_handShare('Twitter')">
							<el-image lazy class="img" :src="share.twitter"></el-image>
						</div>
						<div class="item-icon" @click="_handShare('Pinterest')">
							<el-image lazy class="img" :src="share.pinboard"></el-image>
						</div>
						<div class="item-icon" @click="_handShare('Linkedin')">
							<el-image lazy class="img" :src="share.linkedin"></el-image>
						</div>
						<div class="item-icon" v-if="!isLogin" @click="_handShare('copy')"><i
								class="icon el-icon-paperclip"></i></div>
						<div class="item-icon" v-else v-copy="urlCopy"><i class="icon el-icon-paperclip"></i></div>
					</div>
				</li>
				<li @click="_handShare('Messenger')">
					<i class="el-icon-chat-dot-round"></i>
					<div class="message">Messenger</div>
				</li>
				<li @click="_handScroolTop">
					<i class="top el-icon-d-arrow-right"></i>
				</li>
			</ul>
		</div>
		<popMsg />
	</div>
</template>

<script>
	import {
		Input,
		Dialog
	} from 'element-ui'
	import {
		category
	} from '@/api/category.js'
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import {
		share
	} from '../../utlis/utlis.js'
	export default ({
		name: 'headers',
		// inject:['reload'],
		components: {
			[Input.name]: Input,
			[Dialog.name]: Dialog,
			miniLogin: () => import('@/components/miniLogin'),
			popMsg: () => import('@/components/popMsg')
		},
		data() {
			return {
				searchVal: this.$route.query.name || '',
				loginDialog: false,
				ismy: false,
				ismybox: false,
				category,
				categoryChildren: category[0],
				categoryShow: false,
				qrimg: require('../../assets/image/qr.png'),
				share: {
					fb: require('../../assets/image/social/Facebook.svg'),
					twitter: require('../../assets/image/social/Twitter.svg'),
					pinboard: require('../../assets/image/social/Pinterest.svg'),
					linkedin: require('../../assets/image/social/LinkedIn.svg'),
				}
			}
		},
		computed: {
			//显示用户信息框，只有两个都为true显示就显示
			showUserInfo() {
				return this.ismy || this.ismybox ? true : false
			},
			urlCopy() {
				const {
					uid
				} = this.userInfo;
				const {
					host,
					pathname
				} = window.location;
				return `${host}${pathname}?u=${uid}`
			},
			...mapGetters([
				'isLogin',
				'userInfo',
				'cartNum'
			])
		},
		methods: {
			//显示登录弹框
			showLogin() {
				this.loginDialog = true
			},
			//隐藏登录弹框
			handleClose(isSuccess = false) {
				this.loginDialog = false;
				// if(isSuccess){
				// 	this.reload();
				// }
			},
			//
			handMouseover() {
				this.ismy = true
			},
			mouseleave() {
				setTimeout(() => {
					this.ismy = false
				}, 100)
			},
			handMouseover1() {
				this.ismybox = true
			},
			mouseleave1() {
				setTimeout(() => {
					this.ismybox = false
				}, 100)

			},
			//显示分类底下的子类
			_handMenuMouseMove(id) {
				let categoryChildren = this.category.filter(n => {
					if (n.id == id) {
						return n.children
					}
				})
				this.categoryChildren = categoryChildren[0]
			},
			//点击菜单
			_handMenu(id) {
				const {
					name
				} = this.$route.query;
				if (name) {
					this.$router.push({
						path: '/productlist?pid=' + id + '&name=' + name
					})
				} else {
					this.$router.push({
						path: '/productlist?pid=' + id
					})
				}	
				this.categoryShow = false
			},
			//退出登录
			async _handSingout() {
				let out = await this.singOut();
				if (out) {
					this.$message.success('Logout success')
				}
				if (this.$route.meta.isLogin) {
					this.$router.push('/')
				}
			},
			//url跳转
			_handToUrl() {
				this.$router.push('/');
			},
			//回到顶部
			_handScroolTop() {
				let top = document.documentElement.scrollTop || document.body.scrollTop;
				const timer = setInterval(() => {
					document.body.scrollTop = document.documentElement.scrollTop = top -= 100
					if (top <= 0) {
						clearInterval(timer)
					}
				}, 5)
			},
			// 分享
			_handShare(name) {
				let {
					uid
				} = this.userInfo;
				if (uid) {
					if (name != 'copy') {
						share(name, uid)
					}
				} else {
					this.loginDialog = true
				}
			},
			_handToURL() {
				this.$router.push('/howtogetfreegifts')
			},
			//搜索
			search() {
				let {
					name,
					pid
				} = this.$route.query;
				if (this.$route.path == '/productlist') {
					name = name ? name : '';
					if (name != this.searchVal) {
						if (pid) {
							if (this.searchVal != '') {
								this.$router.push({
									path: '/productlist',
									query: {
										name: this.searchVal,
										pid
									}
								})
							} else {
								this.$router.push({
									path: '/productlist',
									query: {
										pid
									}
								})
							}
						} else {
							if (this.searchVal != '') {
								this.$router.push({
									path: '/productlist',
									query: {
										name: this.searchVal
									}
								})
							} else {
								this.$router.push({
									path: '/productlist'
								})
							}
						}

					}
				} else {
					if (this.searchVal != '') {
						this.$router.push({
							path: '/productlist',
							query: {
								name: this.searchVal
							}
						})
					} else {
						this.$router.push({
							path: '/productlist'
						})
					}
				}
			},
			...mapActions({
				getUserInfo: 'userInfo/getUserInfo',
				singOut: 'userInfo/singOut'
			})
		}
	})
</script>

<style lang="scss" scoped>
	@mixin iconShare($width:200px) {
		width: $width;
		height: 50px;
		line-height: 50px;
		text-align: center;
		position: absolute;
		left: -$width;
		bottom: 0;
		font-size: $text-size-xs;
		color: $text-color-two;
		text-align: center;
		background-color: #d4d4d4;
		transform: scaleX(0);
		transform-origin: right;
		transition: all .5s;
		border-radius: $border-radius-xs 0 0 $border-radius-xs;
	}

	.header-fixed {
		width: 100%;
		height: 30px;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;
		background-color: #fff;
		box-shadow: 0 2px 4px #ccc;

		.header-fixed-box {
			max-width: $doc-width;
			height: 30px;
			width: 100%;
			margin: 0 auto;
			@include flexBetweeCenter;

			.left {
				display: flex;

				.user-login {
					padding-right: 10px;

					a {
						color: #f39a0f;
						cursor: pointer;
					}
				}

				.deals {
					a {
						color: $text-color-one;
					}
				}
			}

			.right {
				@include flexBetweeCenter;
				text-align: center;

				.my {
					width: 120px;
					height: 30px;
					line-height: 30px;
					position: relative;
					box-sizing: border-box;
					border-top: 2px solid #fff;
					border-left: 1px solid #fff;
					border-right: 1px solid #fff;

					&.active {
						border-top: 2px solid $text-color-three;
						border-left: 1px solid $text-color-three;
						border-right: 1px solid $text-color-three;

					}

					span {
						cursor: pointer;
					}

					.my-box {
						position: absolute;
						top: 28px;
						left: -65px;
						width: 220px;
						background-color: #fff;
						border: 1px solid #ccc;
						padding: 25px 15px 15px;

						>p {
							width: 118px;
							height: 2px;
							// opacity: 0;
							// border-bottom: 2px solid #fff;
							background-color: #fff;
							position: absolute;
							left: 64px;
							top: -2px;
						}

						.login-reg {
							.header-user {
								display: flex;

								img {
									width: 60px;
									height: 60px;
									border-radius: $border-radius-md;
								}

								.header-info {
									flex: 1;
									text-align: left;
									padding-left: 8px;

									p {
										text-align: left;
									}

									span {
										color: $text-color-three;
									}
								}

							}

							button {
								width: 100%;
								height: 40px;
								line-height: 40px;
							}

							button:first-child {
								@include buttonBrand;
							}

							button:last-child {
								@include buttonBrandfu;
							}

							>p {
								height: 40px;
								line-height: 40px;
								text-align: center;
								color: $text-color-three;
							}
						}

						.menu-link {
							margin-top: 16px;
							text-align: left;

							.menu-item {
								height: 36px;
								line-height: 36px;

								a {
									color: $text-color-one
								}
							}
						}
					}
				}

				.cart {
					width: 80px;
					position: relative;

					i {
						font-size: $text-size-lg;
					}

					em {
						position: absolute;
						top: -3px;
						right: 17px;
						background-color: $bj-color-brand;
						color: #fff;
						border-radius: $border-radius-2x;
						font-size: $text-size-xs;
						width: 16px;
						height: 16px;
						text-align: center;
						line-height: 16px;
					}
				}

				.wish {
					i {
						font-size: 22px;
					}

					span {
						padding-left: 4px;
					}
				}
			}
		}
	}

	.header-box {
		background-color: #fff;
		padding-bottom: 10px;
	}

	.header-node {
		width: 100%;
		max-width: $doc-width;
		margin: 0 auto;
		display: flex;
		flex-direction: column;

		.content-box {
			display: flex;
			align-items: center;
			margin-top: 50px;

			.logo {
				width: 250px;

				img {
					width: 100%;
				}
			}

			.menu {
				width: 140px;
				padding: 0 30px;
				cursor: pointer;
				position: relative;

				.menu-item {
					display: flex;
					align-items: center;

					.txt {
						line-height: 24px;
					}

					i {
						font-size: $text-size-3x;
					}
				}

				.menu-box {
					width: 800px;
					background-color: #fff;
					border-radius: $border-radius-md;
					box-shadow: $box-shadow-light;
					padding: 20px;
					position: absolute;
					left: 20px;
					top: 50px;
					z-index: 9;
					display: flex;

					.left {
						width: 280px;

						.left-item {
							height: 35px;
							font-weight: bold;

							&:hover {
								color: $text-color-brand;
							}
						}
					}

					.right {
						flex: 1;
						transform: translate(40px);

						.right-item {
							width: 250px;
							height: 35px;
							float: left;
							color: $text-color-two;

							&::after {
								content: '';
								clear: both;
							}

							&:hover {
								color: $text-color-brand;
							}
						}
					}
				}

			}

			.search {
				flex: 1;
				display: flex;

				.search-inp {
					flex: 1;
				}

				.search-btn {
					width: 100px;
					height: 40px;
					line-height: 40px;
					@include buttonBrand;
					margin-left: 20px;
				}
			}
		}

		.nav-box {
			margin-top: 30px;

			ul {
				display: flex;

				li {
					margin-right: 30px;
					height: 30px;
					line-height: 30px;

					a {
						color: $text-color-two;

						&:hover {
							color: $text-color-brand;
						}
					}
				}
			}
		}
	}

	.icon-right {
		position: fixed;
		right: 0;
		bottom: 200px;
		background-color: #d4d4d4;
		width: 50px;
		z-index: 9;
		border-radius: $border-radius-xs 0 0 $border-radius-xs;

		ul {
			li {
				width: 50px;
				height: 50px;
				line-height: 50px;
				text-align: center;
				cursor: pointer;
				position: relative;
				transition: all .2s;

				i {
					font-size: $text-size-md;
				}

				.top {
					transform: rotate(-90deg);
				}

				p {
					@include iconShare(140px)
				}

				&:hover {
					background-color: #f1f1f1;

					p {
						transform: scale(1);
					}

					.qr-box {
						transform: scale(1);
					}

					.share-box {
						transform: scaleX(1);
					}

					.message {
						transform: scale(1);
					}
				}

				.qr-box {
					width: 160px;
					height: 180px;
					padding-top: 5px;
					background-color: #fff;
					position: absolute;
					left: -160px;
					bottom: 0;
					transform: scale(0);
					transition: all .5s;
					transform-origin: right bottom;

					span {
						font-size: $text-size-xs;
					}

					.img {
						width: 150px;
					}
				}

				.share-box {
					@include iconShare(200px) display: flex;
					align-items: center;

					.item-icon {
						height: 30px;
						flex: 1;

						.img {
							width: 25px;
							height: 25px;
						}

						.icon {
							font-size: $text-size-lg;
						}
					}
				}

				.message {
					@include iconShare(80px)
				}
			}

			li:not(:last-child) {
				border-bottom: 1px solid #fff;
			}
		}
	}
</style>
