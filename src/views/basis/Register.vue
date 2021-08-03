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
						<input type="password" v-model="login.pass1" placeholder="Your password" />
					</div>
					<div class="login-from-item">
						<i class="iconfont icon-mima"></i>
						<input type="password" v-model="login.pass2" placeholder="Your password" />
					</div>
					<div class="login-from-item login-from-code">
						<i class="el-icon-s-claim"></i>
					  <input v-model="login.code" maxlength="4" placeholder="Enter verify code" />
					  <img id="codeimg" height="40px" src="" alt="">
	
					</div>
					<div class="login-from-btn">
						<el-button class="btn" type="primary" @click="_handLogin" :disabled="disabled">Register</el-button>
					</div>
					<div class="login-txt">
						<el-link :underline="false" :href="forgoturl">Forgot Password</el-link>
						<el-link :underline="false" :href="loginurl">Login</el-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {cmdEncrypt} from '@/assets/js/RSAz.js'
	import {regEmail} from '@/utlis/regular.js'
	import {mapActions} from 'vuex'
	import {Link} from 'element-ui'
	export default({
		name:'Register',
		components:{
			[Link.name]:Link
		},
		data(){
			return{
				login:{
					email:'',
					pass1:'',
					pass2:'',
					code:''
				},
				disabled:false,
				tofrom:this.$route.query.tofrom  //来自哪个页面
			}
		},
		computed:{
			loginurl(){
				let tofrom=this.tofrom;
				return tofrom?`/login?from=${tofrom}`:`/login`
			},
			forgoturl(){
				let tofrom=this.tofrom;
				return tofrom?`/forgotpassword?from=${tofrom}`:`/forgotpassword`
			}
		},
		mounted() {
			this.showCode()
		},
		methods:{
			async _handLogin(){
				let {email,pass1,pass2,code}=this.login;
				if(email==''){
					this.$message.warning('Please enter your email.')
					return;
				}else if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid.')
					return;
				}
				if(pass1==''){
					this.$message.warning('Enter password')
					return;
				}
				if(pass2==''){
					this.$message.warning('Please enter the password.')
					return;
				}
				if(pass1!=pass2){
					this.$toast.fail('The password is not consistent with the confirmation password.')
					return;
				}
				if(code==''){
					this.$message.warning('Please enter your code.')
					return;
				}
				this.disabled=true
				//加密
				let rsa=await this.$api.verify.CreateRSAKey();
				let rsapass=''
				if(rsa!=''){
					if(rsa.rescode==0){
						 rsapass = cmdEncrypt(pass1, rsa.strPublicKeyExponent, rsa.strPublicKeyModulus);
					}else{
						this.$message.error('Failed to create encrypted data. Please try again.');
						this.disabled=false
						return
					}
				}else{
					this.$message.error('Failed to create encrypted data. Please try again.');
					this.disabled=false
					return;
				}
				let loginForm={Yzm:code,Email:email,password1:rsapass,password2:rsapass};
				this.$api.user.register(loginForm).then(res=>{
					if(res.fsstate==0){
						if(res.fsstate=='0'){
							this.$message.success('Register success')
						}
						if(this.tofrom){
							this.$router.push({path:tofrom});
						}else{
							this.$router.push({path:'/'});
						}
						this.getUserInfo();
						this.$emit('closeDialog',true)
					}else{
						this.$message.error(res.fsmes)
					}
					this.disabled=false
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
	
</style>
