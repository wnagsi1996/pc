<template>
	<div>
		<div class="login-box">
			<div class="login-logo">
				<a href="/">
					<img src="../../assets/image/logo.png" alt="">
				</a>
			</div>
			<div class="login-node">
				<div class="login-title">Weclome to you</div>
				<div class="login-from">
					<div class="login-from-item">
						<i class="el-icon-s-custom"></i>
						<input type="text" v-model="login.email" placeholder="Your email" />
					</div>
					<div class="login-from-item">
						<i class="iconfont icon-mima"></i>
						<input type="password" v-model="login.pass" placeholder="Your password" />
					</div>
					<div class="login-from-item login-from-code">
						<i class="el-icon-s-claim"></i>
					  <input v-model="login.code" maxlength="4" placeholder="Enter verify code" />
					  <img id="codeimg" height="40px" src="" alt="">
	
					</div>
					<div class="login-from-btn">
						<el-button class="btn" type="primary" @click="_handLogin" :loading="loading">Login</el-button>
					</div>
					<div class="login-txt">
						<el-link :underline="false" :href="forgoturl">Forgot Password</el-link>
						<el-link :underline="false" :href="regurl">Register</el-link>
					</div>
					<Fblogin></Fblogin>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {cmdEncrypt} from '@/assets/js/RSAz.js'
	import {regEmail} from '@/utlis/regular.js'
	import {mapActions,mapGetters} from 'vuex'
	import {Link} from 'element-ui'
	export default({
		name:'Login',
		components:{
			[Link.name]:Link,
			Fblogin:()=>import('@/components/FbLogin')
		},
		data(){
			return{
				login:{
					email:'',
					pass:'',
					code:''
				},
				loading:false,
				tofrom:this.$route.query.tofrom
			}
		},
		computed:{
			regurl(){
				let tofrom=this.tofrom;
				return tofrom?`/register?from=${tofrom}`:`/register`
			},
			forgoturl(){
				let tofrom=this.tofrom;
				return tofrom?`/forgotpassword?from=${tofrom}`:`/forgotpassword`
			},
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
		mounted() {
			this.showCode()
		},
		methods:{
			async _handLogin(){
				let {email,pass,code}=this.login;
				if(email==''){
					this.$message.warning('Please enter your email.')
					return;
				}else if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid.')
					return;
				}
				if(pass==''){
					this.$message.warning('Please enter your password.')
					return;
				}
				if(code==''){
					this.$message.warning('Please enter your code.')
					return;
				}
				this.loading=true
				//加密
				let rsa=await this.$api.verify.CreateRSAKey();
				let rsapass=''
				if(rsa!=''){
					if(rsa.rescode==0){
						 rsapass = cmdEncrypt(pass, rsa.strPublicKeyExponent, rsa.strPublicKeyModulus);
					}else{
						this.$message.error('Failed to create encrypted data. Please try again.');
						this.loading=false
						return
					}
				}else{
					this.$message.error('Failed to create encrypted data. Please try again.');
					this.loading=false
					return;
				}
				let loginForm={VerifyCode:code,lname:email,pass:rsapass,VerifyType:'valiregister'};	
				this.userLogin(loginForm).then(res=>{
					if(res.rescode==0){
						if(this.tofrom){
							this.$router.push({path:this.tofrom});
						}else{
							this.$router.push({path:'/'});
						}
					}else{
						this.$message.error(res.resdesc)
					}
					this.loading=false
				})
			},
			//获取图片验证码
			showCode(){
				let url=""
				process.env.NODE_ENV==='development'?url="/Handler":url='';  //区分开发环境加‘/Handler’，生产环境不加
				document.getElementById('codeimg').src=url+'/UserControl/Validata.aspx?ValiType=valiregister&' + Math.random();
			},
			...mapActions({
				userLogin:'userInfo/login'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.login-box{
		width: 390px;
		margin:150px auto;
		.login-logo{
			width: 300px;
			margin: 0 auto 30px;
			img{
				width: 100%;
			}
		}
		.login-node{
			width: 350px;
			background-color: #fff;
			box-shadow: $box-shadow-light;
			border-radius: $border-radius-md;
			padding: 30px 20px;
			.login-title{
				font-size:$text-size-2x;
				text-align: center;
			}
			.login-from{
				margin-top: 20px;
				.login-from-item{
					width: 330px;
					padding:20px 0 10px;
					margin:20px 0;
					height: 30px;
					border-bottom: 1px solid $text-color-four;
					display: flex;
					i{
						font-size:$text-size-lg;
						color:$text-color-brand
					}
					input{
						border: none;
						outline:none;
						padding-left: 10px;
						display: block;
						flex: 1;
					}
				}
				.login-from-code{
					display: flex;
					justify-content: space-around;
					align-items: flex-end;
				}
				.login-from-btn{
					margin-top: 30px;
					.btn{
						width: 100%;
					}
				}
				.login-txt{
					margin-top: 20px;
					@include flexBetweeCenter
				}
			}
		}
	}
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
