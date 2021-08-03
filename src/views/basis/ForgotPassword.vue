<template>
	<div>
		<div class="login-box">
			<div class="login-logo">
				<a href="/">
					<img src="../../assets/image/logo.png" alt="">
				</a>
			</div>
			<div class="login-node">
				<div class="login-title">Forgot Password</div>
				<div class="login-desc">Please enter the login id of the account to retrieve your password</div>
				<div class="login-from" v-if="!passNode">
					<div class="login-from-item">
						<i class="el-icon-s-custom"></i>
						<input type="text" v-model="forgot.email" placeholder="Your email" />
					</div>
					<div class="login-from-item login-from-code" v-if="isCode">
						<i class="el-icon-s-claim"></i>
						<input v-model="forgot.code" maxlength="4" placeholder="Enter verify code" />
						<img id="codeimg" height="40px" src="" alt="">
					</div>
					<div class="login-from-item login-from-code">
						<i class="el-icon-s-claim"></i>
						<input v-model="forgot.code" maxlength="4" placeholder="Enter verify code" />
						<el-button v-show="!timeshow" @click="_handCode">Get Code</el-button>
						<el-button v-show="timeshow" >getCode again {{ time }}</el-button>
					</div>
					<div class="login-from-btn">
						<el-button class="btn" type="primary" @click="_handNext" :disabled="disabled">Next</el-button>
					</div>
					<div class="login-txt">
						<el-link :underline="false" :href="regurl">Register</el-link>
						<el-link :underline="false" :href="loginurl">Login</el-link>
					</div>
				</div>
				<div class="login-from" v-else>
					<div class="login-from-item">
						<i class="el-icon-s-custom"></i>
						<input type="password" v-model="forgot.pass1" placeholder="Enter new password" />
					</div>
					<div class="login-from-item">
						<i class="el-icon-s-custom"></i>
						<input type="password" v-model="forgot.pass2" placeholder="Enter new password" />
					</div>
					<div class="login-from-btn">
						<el-button class="btn" type="primary" @click="_handSubmit" :disabled="disabled">Submit</el-button>
					</div>
					<div class="login-txt">
						<el-link :underline="false" :href="regurl">Register</el-link>
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
	import {getSecondByDateSub} from '@/assets/js/public.js'  //时间计算/判断设备
	export default({
		name:'ForgotPassword',
		components:{
			[Link.name]:Link
		},
		data(){
			return{
				forgot:{
					email:'',
					pass1:'',
					pass2:'',
					imgCode:'', //图形验证码
					code:''  ,//邮箱验证码
					time:'300' ,//倒计时秒数
					timeshow:false,
					isCode:false  //图形验证码，默认不需要
				},
				passNode:false,
				disabled:false,
				tofrom:this.$route.query.tofrom
			}
		},
		computed:{
			regurl(){
				let tofrom=this.tofrom;
				return tofrom?`/register?from=${tofrom}`:`/register`
			},
			loginurl(){
				let tofrom=this.tofrom;
				return tofrom?`/login?from=${tofrom}`:`/login`
			}
		},
		methods:{
			//倒计时
			counDown(val){
				let time=eval(val);
				if(time!='' && time>=0){
					return time-1
				}
			},
			//获取验证码
			_handCode(){
				let {email}=this.forgot;
				if(email==''){
					this.$message.warning('Please enter your email.')
					return;
				}else if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid.')
					return;
				}
				this.$api.verify.getEmailVerify({Phone:this.email,VerifyCode:this.imgCode}).then(res=>{
					this.$message.success(res.fsmes);
					if(res.fsstate==0){
						let fssj=res.fssj;
						let fcffssj=res.fcffssj;
						this.time=getSecondByDateSub(fssj,fcffssj);
						let timer=setInterval(()=>{
							this.time=this.counDown(this.time)
							if(this.time==0){
								clearInterval(timer);
							}
						},1000)
					}else if(res.fsstate==5){
						this.isCode=true
						this.showCode();
					}
				})
			},
			//下一步
			_handNext(){
				let {email,code}=this.forgot;
				if(email==''){
					this.$message.warning('Please enter your email.')
					return;
				}else if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid.')
					return;
				}
				if(code==''){
					this.$message('Please enter the code in your email.');
					return false;
				}
				this.disabled=true;
				this.$api.verify.comitEmailVerify({Phone:email,Yzm:code}).then(res=>{
					console.log(res)
					if(res.fsstate==0){
						this.passNode=true;
						//this.$refs.emailForm.resetValidation();
					}else{
						this.$message.warning(res.fsmes)
					}
					this.disabled=false
				}).catch(xhr=>{
					this.$message.warning('Failed, please try again')
					this.disabled=false
				})
				
			},
			async _handSubmit(){
				let {email,code,pass1,pass2}=this.forgot;
				if(pass1==''){
					this.$message.warning('Enter password')
					return;
				}
				if(pass2==''){
					this.$message.warning('Please enter password again.')
					return;
				}
				if(pass1!=pass2){
					this.$message.warning('The password is not consistent with the confirmation password.')
				}
				let patrn1 = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,16}$/;
				if (!patrn1.test(pass1)) {
					this.$message.warning('The password format does not meet the requirements.');
					return ;
				}
				this.disabled=true
				//加密
				let rsa=await this.$api.verify.CreateRSAKey();
				let rsapass=''
				if(rsa!=''){
					if(rsa.rescode==0){
						 rsapass = cmdEncrypt(pass, rsa.strPublicKeyExponent, rsa.strPublicKeyModulus);
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
				let loginForm={Yzm:code,Phone:email,password1:rsapass,password2:rsapass};	
				this.$api.verify.ComitPassWord(loginForm).then(res=>{
					console.log(res)
					if(res.fsstate=='0'){
						this.$message.success('Password reset succeeded.');
						this.$store.commit('userInfo/SETLOGIN',true);
						this.$router.push({path:'/'})
					}else{
						this.$message.fail(res.fsmes)
					}
					this.disabled=false
				}).catch(xhr=>{
					this.$message.fail('Register Fail')
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
			.login-desc{
				margin-top: 15px;
				color: $text-color-two;
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
