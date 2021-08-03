<template>
	<div class="login-box">
		  <div class="login-head">
			  <div class="name" :class="navActive==0?'active':''" @click="handNav(0)">Login</div>
			  <div class="name" :class="navActive==1?'active':''" @click="handNav(1)">Register</div>
		  </div>
		  <div class="node-box">
			  <div class="login-box" v-show="navActive==0">
				  <div class="item">
					  <label for="">Email:</label>
					  <input v-model="login.email" placeholder="Enter your email" />
				  </div>
				  <div class="item">
					  <label for="">Password:</label>
					  <input type="password" v-model="login.pass" placeholder="Enter password" />
				  </div>
				  <div class="item">
					  <label for="">Code:</label>
					  <div class="code">
						  <input v-model="login.code" maxlength="4" @keydown.13="handLogin" placeholder="Enter verify code" />
						  <img id="codeimg0" height="40px" src="" alt="">
					  </div>
				  </div>
				  <div class="btn">
					  <el-button type="primary" @click="handLogin" :loading="loading">Login</el-button>
				  </div>
				  <Fblogin></Fblogin>
			  </div>
			  <div class="login-box" v-show="navActive==1">
				  <div class="item">
					  <label for="">Email:</label>
					  <input v-model="register.email" placeholder="Enter your email" />
				  </div>
				  <div class="item">
					  <label for="">Password:</label>
					  <input type="password" v-model="register.pass1" placeholder="Enter password" />
				  </div>
				  <div class="item">
					  <label for="">Password:</label>
					  <input type="password" v-model="register.pass2" placeholder="In enter your password again" />
				  </div>
				  <div class="pass-txt">
					  <p>1.The password must consist of numbers and letters.</p>
					  <p>2.Password length must be 6-16 characters.</p>
				  </div>
				  <div class="item">
					  <label for="">Code:</label>
					  <div class="code">
						  <input v-model="register.code" @keydown.13="handRegister" placeholder="Enter verify code" />
						  <img id="codeimg1" height="40px" src="" alt="">
					  </div>
				  </div>
				  <div class="btn">
					  <el-button type="primary" @click="handRegister" :loading="loading">Register</el-button>
				  </div>
			  </div>
		  </div>
	</div>
</template>

<script>
	import {cmdEncrypt} from '@/assets/js/RSAz.js'
	import {regEmail} from '@/utlis/regular.js'
	import {mapActions,mapGetters} from 'vuex'
	import {fblogin,loadFile} from '../../utlis/login.js'
	export default({
		name:'miniLogin',
		components:{
			Fblogin:()=>import('@/components/FbLogin')
		},
		data(){
			return{
				navActive:0,  //0代表登录，1代表注册
				login:{
					email:'',
					pass:'',
					code:''
				},
				register:{
					email:'',
					pass1:'',
					pass2:'',
					code:''
				},
				loading:false
			}
		},
		computed:{
			...mapGetters([
				'userInfo'
			])
		},
		created() {
			
		},
		mounted() {
			this.showCode(0)
		},
		methods:{
			//切换登录注册
			handNav(num){
				if(this.navActive!=num){
					this.navActive=num;
					this.showCode(num)
				}
			},
			//登录
			async handLogin(){
				let {email,pass,code}=this.login;
				if(email==''){
					this.$message.warning('Please enter the Email.')
					return;
				}else if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid')
					return;
				}
				if(pass==''){
					this.$message.warning('Please enter the password.')
					return;
				}
				if(code==''){
					this.$message.warning('Please enter the VerifyCode.')
				}
				this.loading=true
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
						this.getUserInfo();
						this.$message.success('Login Success')
						this.$emit('closeDialog',true)
					}else{
						this.$message.error(res.resdesc)
					}
					this.loading=false
				})
				
			},
			//注册
			async handRegister(){
				
				let {email,pass1,pass2,code}=this.register;
				
				if(email==''){
					this.$message.warning('Please enter the Email.')
					return;
				}else if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid')
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
					this.$message.warning('Please enter the VerifyCode.')
				}
				
				this.disabled=true
				try{
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
							this.getUserInfo();
							this.$emit('closeDialog',true)
						}else{
							this.$message.error(res.fsmes)
						}
						this.disabled=false
					})
				}catch(e){
					console.log(e)
				}
			},
			//获取图片验证码
			showCode(num){
				let url=""
				process.env.NODE_ENV==='development'?url="/Handler":url='';  //区分开发环境加‘/Handler’，生产环境不加
				document.getElementById(`codeimg${num}`).src=url+'/UserControl/Validata.aspx?ValiType=valiregister&' + Math.random();
			},
			...mapActions({
				userLogin:'userInfo/login',
				getUserInfo:'userInfo/getUserInfo'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.login-box{
		color: $text-color-one;
		.login-head{
			@include flexBetweeCenter;
			.name{
				width: 160px;
				color: $text-color-one;
				text-align: center;
				padding:0 0 8px;
				cursor: pointer;
				border-bottom: 1px solid $text-color-one;
			}
			.active{
				color:$text-color-brand;
				border-bottom: 1px solid $text-color-brand;
			}
		}
		.node-box{
			margin-top: 30px;
			.login-box{
				.item{
					margin: 30px 0 0;
					display: flex;
					flex-direction: column;
					label{
						padding-bottom: 10px;
					}
					.code{
						display: flex;
						align-items: center;
					}
					input{
						height: 36px;
						padding:0 5px;
						border:1px solid $text-color-three;
						border-radius: $border-radius-sm;
						outline: none;
						&:focus{
							border:1px solid $text-color-brand;
						}
						&::-webkit-input-placeholder{
							color:$text-color-four;
						}
					}
				}
				.pass-txt{
					p{
						padding:4px 0;
					}
				}
				.btn{
					margin-top: 30px;
					button{
						width: 100%;
					}
				}
			}
		}
	}
</style>
