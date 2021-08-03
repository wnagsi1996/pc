import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Home',
		component: () => import('../views/basis/Home.vue'),
		meta: {
			title: 'iSHARE'
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/basis/Login.vue'),
		meta: {
			title: 'iSHARE-Login'
		}
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/basis/Register.vue'),
		meta: {
			title: 'iSHARE-Register'
		}
	},
	{
		path: '/forgotpassword',
		name: 'ForgotPassword',
		component: () => import('@/views/basis/ForgotPassword.vue'),
		meta: {
			title: 'iSHARE-ForgotPassword'
		}
	},
	{
		path: '/productlist',
		name: 'ProductList',
		component: () => import('@/views/basis/ProductList.vue'),
		meta: {
			title: 'iSHARE-ProductList'
		}
	},
	{
		path: '/freelist',
		name: 'FreeList',
		component: () => import('@/views/basis/FreeList.vue'),
		meta: {
			title: 'iSHARE-Free List'
		}
	},

	{
		path: '/product',
		name: 'Product',
		component: () => import('@/views/basis/ProductDetail.vue')
	},
	{
		path: '/cart',
		name: 'Cart',
		component: () => import('@/views/basis/Cart.vue'),
		meta: {
			bj: true,
			title: 'iSHARE-Cart'
		}
	},
	{
		path: '/payment',
		name: 'Payment',
		component: () => import('@/views/basis/Payment.vue'),
		meta: {
			bj: true,
			isLogin: true,
			title: 'iSHARE-Payment'
		}
	},
	{
		path: '/paymentsuccessful',
		name: 'PaymentSuccessful',
		component: () => import('@/views/basis/PaymentSuccessful.vue'),
		meta: {
			bj: true,
			isLogin: true,
			title: 'iSHARE-Payment Successful'
		}
	},
	{
		path: '/groupswait/:orderno',
		name: 'GroupsWait',
		component: () => import('@/views/basis/GroupsWait.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-Groups Wait'
		}
	},
	{
		path: '/usercenter',
		name: 'UserCenter',
		component: () => import('@/views/user/UserCenter.vue'),
		meta: {
			isLogin: true,
			meta: {
				isLogin: true,
				title: 'iSHARE-UserCenter'
			}
		}
	},
	{
		path: '/mygifts',
		name: 'MyGifts',
		component: () => import('@/views/user/MyGifts.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Gifts'
		}
	},
	{
		path: '/myorder',
		name: 'MyOrder',
		component: () => import('@/views/user/MyOrder.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Order'
		}
	},
	{
		path: '/mylike',
		name: 'MyLike',
		component: () => import('@/views/user/MyLike.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Like'
		}
	},
	{
		path: '/mymembers',
		name: 'MyMembers',
		component: () => import('@/views/user/MyMembers.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Members'
		}
	},
	{
		path: '/myprofile',
		name: 'MyProfile',
		component: () => import('@/views/user/MyProfile.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Profile'
		}
	},
	{
		path: '/myaddress',
		name: 'MyAddress',
		component: () => import('@/views/user/MyAddress.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Address'
		}
	},
	{
		path: '/myincome',
		name: 'MyIncome',
		component: () => import('@/views/user/MyIncome.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Income'
		}
	},
	{
		path: '/mycoupon',
		name: 'MyCoupon',
		component: () => import('@/views/user/MyCoupon.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Coupon'
		}
	},
	{
		path: '/mynotices',
		name: 'MyNotices',
		component: () => import('@/views/user/MyNotices.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-My Notices'
		}
	},
	{
		path: '/setting',
		name: 'Setting',
		component: () => import('@/views/user/Setting.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-Setting'
		}
	},
	{
		path: '/myaffiliate',
		name: 'MyAffiliate',
		component: () => import('@/views/basis/MyAffiliate.vue'),
		meta: {
			title: 'iSHARE-My Affiliate'
		}
	},
	{
		path: '/howtogetfreegifts',
		name: 'HowToGetFreeGifts',
		component: () => import('@/views/basis/HowToGetFreeGifts.vue'),
		meta: {
			title: 'iSHARE-How To Get Free Gifts'
		}
	},
	{
		path: '/groupswaitbuy/:orderno',
		name: 'GroupsWaitBuy',
		component: () => import('@/views/basis/GroupsWaitBuy.vue'),
		meta: {
			isLogin: true,
			title: 'iSHARE-Groups Wait Buy'
		}
	},
	{
		path: '/groupbuy/:orderno',
		name: 'GroupsBuy',
		component: () => import('@/views/basis/GroupsBuy.vue'),
		meta: {
			title: 'iSHARE-Groups Buy'
		}
	},
	{
		path: '/grouphelp/:orderno',
		name: 'GroupsHelp',
		component: () => import('@/views/basis/GroupsHelp.vue'),
		meta: {
			title: 'iSHARE-Groups Buy'
		}
	},
	{
		path: '/dealslist',
		name: 'DealsList',
		component: () => import('@/views/basis/DealsList.vue'),
		meta: {
			title: 'iSHARE-Deals List'
		}

	},
	{
		path: '/deals',
		name: 'DealDetail',
		component: () => import('@/views/basis/DealDetail.vue'),
	},
	{
		path: '/aboutus',
		name: 'AboutUs',
		component: () => import('@/views/basis/AboutUs.vue'),
		meta: {
			title: 'iSHARE-About Us',
			bj: true
		}
	},
	{
		path: '/contactus',
		name: 'ContactUs',
		component: () => import('@/views/basis/ContactUs.vue'),
		meta: {
			title: 'iSHARE-Contact Us'
		}
	},
	{
		path: '/returnpolicy',
		name: 'ReturnPolicy',
		component: () => import('@/views/basis/ReturnPolicy.vue'),
		meta: {
			title: 'iSHARE-Return Policy'
		}
	},
	{
		path: '/termsofuse',
		name: 'TermsOfUse',
		component: () => import('@/views/basis/TermsOfUse.vue'),
		meta: {
			title: 'iSHARE-Terms Of Use'
		}
	},
	{
		path: '/privacysecuritypolicy',
		name: 'PrivacySecurityPolicy',
		component: () => import('@/views/basis/PrivacySecurityPolicy.vue'),
		meta: {
			title: 'iSHARE-Privacy Security Policy'
		}
	},
	{
		path: '/faq',
		name: 'FAQ',
		component: () => import('@/views/basis/FAQ.vue'),
		meta: {
			title: 'iSHARE-FAQ'
		}
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/views/basis/404.vue'),
		meta: {
			title: 'iSHARE-404'
		}
	},
	{
		path: '/shop',
		name: 'ShopHeader',
		component: () => import('@/views/basis/ShopHeader.vue'),
		// meta:{
		//  title:'iSHARE-Shop'
		// },
		children: [{
				path: ':id',
				name: 'ShopList',
				component: () => import('@/views/basis/ShopList.vue'),
				meta: {
					title: 'iSHARE-Shop'
				},
			},
			{
				path: 'detail/:id',
				name: 'ShopDetail',
				component: () => import('@/views/basis/ShopDetail.vue'),
				meta: {
					title: 'iSHARE-Shop'
				},
			}
		]
	}
]

const router = new VueRouter({
	mode: 'history',
	// base: process.env.BASE_URL,
	base: process.env.NODE_ENV === "production" ? "pc" : "/",
	routes
})

export default router
