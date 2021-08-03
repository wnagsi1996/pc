<template>
	<div class="dsflogin">
	  <div class="or">OR</div>
	  <div class="login-itme" @click="_handFbLogin">
		<img src="../../assets/image/social/icon_1.png" alt="">
		<span>Login With Facebook</span>
	  </div>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {fblogin} from '../../utlis/login.js'
	export default({
		name:'FbLogin',
		computed:{
			...mapGetters([
				'userInfo'
			])
		},
		created() {
			const {FB_Client_ID}=this.userInfo;
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			} (document, 'script', 'facebook-jssdk'));
			window.fbAsyncInit=()=> {
				FB.init({
					appId: FB_Client_ID,
					cookie: true,  // enable cookies to allow the server to access 
					// the session
					xfbml: true,  // parse social plugins on this page
					version: 'v3.2' // The Graph API version to use for the call
				});
			};
		},
		methods:{
			//fb登录
			_handFbLogin(){
				const {path}=this.$route;
				const {FBClientRedirectDomain,FBDomain,FB_CallBackUrl,FB_Client_ID}=this.userInfo;
				fblogin(FB_CallBackUrl,path,FBClientRedirectDomain,FBDomain,FB_Client_ID);
			},
		}
	})
</script>

<style scoped lang="scss">
	.dsflogin{
		.or{
			margin:30px auto;
			text-align: center;
			font-size: $text-size-md;
			color: $text-color-three;
		}
		.login-itme{
			width: 100%;
			height: 50px;
			line-height: 50px;
			@include buttonfb;
			img{
				margin-left: 8px;
				width: 40px;
				height: 40px;
			}
			span{
				color:#fff;
				padding-left: 10px;
				font-size: $text-size-md;
			}
		}
	}
</style>
