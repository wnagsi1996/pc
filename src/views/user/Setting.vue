<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu class="userMenu" />
			<div class="setting-box">
				<el-tabs type="border-card" @tab-click="tabClick">
				  <el-tab-pane label="Setting Password" >
					  <el-form :model="settingPass" status-icon :rules="setPassRules" ref="setPassForm" label-width="200px" class="setting--pass-box">
					    <el-form-item label="Original password" prop="oldPass">
					      <el-input type="password" v-model="settingPass.oldPass" autocomplete="off"></el-input>
					    </el-form-item>
					    <el-form-item label="New password" prop="newpass">
					      <el-input type="password" v-model="settingPass.newpass" autocomplete="off" placeholder="A combination of 6-16 letters and numbers"></el-input>
					    </el-form-item>
						<el-form-item label="Confirm password" prop="checkPass">
						  <el-input type="password" v-model="settingPass.checkPass" autocomplete="off" placeholder="A combination of 6-16 letters and numbers"></el-input>
						</el-form-item>
					    <el-form-item>
					      <el-button type="primary" :loading="btnloading" @click="_handSetPass('setPassForm')">Submit</el-button>
					      <el-button @click="_handResetPass('setPassForm')">Reset</el-button>
					    </el-form-item>
					  </el-form>
				  </el-tab-pane>
				  <el-tab-pane label="Bind Email">
					  <el-form :model="bindEmail" status-icon ref="bindEmail" label-width="200px" class="setting--pass-box" v-show="emailOld">
					    <el-form-item label="Current Bind Email" prop="email">
					      <el-input v-model="userInfo.loginname" readonly autocomplete="off"></el-input>
					    </el-form-item>
					    <el-form-item label="Verify code" prop="imgCode" v-if="bindEmail.isCode">
					      <el-input class="code-inp" v-model="bindEmail.imgCode" autocomplete="off" placeholder="Verify code"></el-input>
						  <img class="codeimg" src='' id="codeimg" @click="showCode" />
					    </el-form-item>
							<el-form-item label="Code" prop="emailCode">
							  <el-input class="code-inp" v-model="bindEmail.emailCode" autocomplete="off" placeholder="Email Code"></el-input>
							  <el-button v-show="bindEmail.timeshow" class="code-btn" size="mini" plain type="primary">getCode again {{ time }}</el-button>
							  <el-button v-show="!bindEmail.timeshow" class="code-btn" size="mini" plain type="primary" @click="_handGetCode">GetCode</el-button>
							</el-form-item>
					    <el-form-item>
					      <el-button style="width: 100px;" type="primary" :loading="btnloading" @click="_handbindEmail">Next</el-button>
					    </el-form-item>
					  </el-form>
					  <el-form :model="newEmail" status-icon ref="newEmail" label-width="200px" class="setting--pass-box" v-show="!emailOld">
					    <el-form-item label="New email" prop="email">
					      <el-input v-model="newEmail.email" autocomplete="off"></el-input>
					    </el-form-item>
							<el-form-item label="Code" prop="emailCode">
							  <el-input class="code-inp" v-model="newEmail.code" autocomplete="off" placeholder="Email Code"></el-input>
							  <el-button v-show="newEmail.timeshow" class="code-btn" size="mini" plain type="primary">getCode again {{ newtime }}</el-button>
							  <el-button v-show="!newEmail.timeshow" class="code-btn" size="mini" plain type="primary" @click="onNewCode">GetCode</el-button>
							</el-form-item>
					    <el-form-item>
					      <el-button style="width: 100px;" type="primary" :loading="btnloading" @click="setNewEmail">Submit</el-button>
					    </el-form-item>
					  </el-form>
				  </el-tab-pane>
				  <el-tab-pane label="Setting Receipt Account">
					 <el-form :model="receipAccount" status-icon ref="receipAccount" label-width="200px" class="setting--pass-box receipe-box">
							<div class="receipe-head">
								<p v-if="accountType!=''">Your Current Receipt {{accountType}} Account:<span class="account"> {{account}}</span></p>
								<el-radio-group v-model="receipAccount.accountType.value" style="margin-top: 20px;">
								    <el-radio :label="1">PayPal</el-radio>
								    <el-radio :label="0">WeChat</el-radio>
								    <el-radio :label="2">CashApp</el-radio>
								  </el-radio-group>
							</div>
						   <el-form-item label="Account" prop="email" style="margin-top: 10px;">
						     <el-input v-model="receipAccount.account" autocomplete="off"></el-input>
						   </el-form-item>
						   <el-form-item>
						     <el-button style="width: 100px;" type="primary" :loading="btnloading" @click="onSubmit">Submit</el-button>
						   </el-form-item>
					 </el-form>
				  </el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	const accountAttr=[
		{
			text:'PayPal',
			value:1
		},
		{
			text:'WebChat',
			value:0
		},
		{
			text:'CashApp',
			value:2
		}
	];
	import userMenu from '@/components/userMenu'
	import {Tabs,TabPane,Form,Input,FormItem,RadioGroup,Radio} from 'element-ui'
	import {cmdEncrypt} from "@/assets/js/RSAz.js"
	import {regPass,regEmail} from '@/utlis/regular.js' 
	import {getSecondByDateSub} from '@/assets/js/public.js'  //时间计算
	import {mapGetters} from 'vuex'
	export default({
		name:'Setting',
		components:{
			userMenu,
			[Tabs.name]:Tabs,
			[TabPane.name]:TabPane,
			[Form.name]:Form,
			[Input.name]:Input,
			[FormItem.name]:FormItem,
			[RadioGroup.name]:RadioGroup,
			[Radio.name]:Radio
		},
		data(){
			var validatePass = (rule, value, callback) => {
				if (value === '') {
				  callback(new Error('Enter New password'));
				} else {
				  if (this.settingPass.checkPass !== '') {
					this.$refs.setPassForm.validateField('checkPass');
				  }
				  callback();
				}
			  };
			  var validatePass2 = (rule, value, callback) => {
				if (value === '') {
				  callback(new Error('Enter New password'));
				} else if (value !== this.settingPass.newpass) {
				  callback(new Error('The password is not consistent with the confirmation password.!'));
				} else {
				  callback();
				}
			  };
			return{
				settingPass:{
					oldPass:'',
					newpass:'',
					checkPass:''
				},
				setPassRules:{
					oldPass:[
						{ required: true, message: 'Enter old password', trigger: 'blur' }
					],
					newpass:[
						{ required: true,validator: validatePass, trigger: 'blur' }
					],
					checkPass:[
						{ required: true,validator: validatePass2, trigger: 'blur' }
					]
				},
				//绑定邮箱旧
				bindEmail:{
					imgCode:'',
					emailCode:'',
					isCode:false,
					timeshow:false,
				},
				//绑定邮箱新
				newEmail:{
					email:'',
					code:'',
					timeshow:false
				},
				// 旧倒计时
				time:300,
				// 新倒计时
				newtime:300,
				emailOld:true,
				btnloading:false,
				
				accountType:'',
				account:'',
				receipAccount:{
					accountType:{
						text:'',
						value:0
					},
					account:''
				},
			}
		},
		computed:{
			...mapGetters([
				'userInfo',
				'userCenterInfo'
			])
		},
		created() {
			
		},
		methods:{
			//Tab切换
			tabClick(e){
				let index=e.index
				if(index==2){
					this.getuserInfo()
				}
			},
			//设置新密码
			_handSetPass(formName){
				 this.$refs[formName].validate(async (valid) => {
					 if(valid){
						 const {oldPass,newpass,checkPass}=this.settingPass;
						 if(!regPass.test(newpass)){
							 this.$message.warning('The password format does not meet the requirements');
							 return;
						 }
						 this.btnloading=true
						 let password1='',password2=''
						try{
							const res=await this.$api.verify.CreateRSAKey();
							if(res.rescode==0){
								password1 = cmdEncrypt(oldPass, res.strPublicKeyExponent, res.strPublicKeyModulus);
								password2 = cmdEncrypt(newpass, res.strPublicKeyExponent, res.strPublicKeyModulus);
							}else{
								this.$message.warning('Modify Password Fail')
								this.btnloading=false;
								return ;
							}
							const params={
								password1,
								password2,
								password3:password2,
							}
							const passRes=await this.$api.user.modifyPassUser(params)
							if(passRes.fsstate=='0'){
								this.$message.success(passRes.fsmes);
								Object.assign(this.settingPass,{
									oldPass:'',
									newpass:'',
									checkPass:''
								})
							}else{
								this.$message.warning(passRes.fsmes);
							}
							
							this.btnloading=false
						}catch(err){
							this.$message.warning('Modify Password Fail')
							this.btnloading=false;
						}
					}
				 })
			},
			_handResetPass(formName){
				 this.$refs[formName].resetFields();
			},
			//倒计时
			counDown(val){
				let time=eval(val);
				if(time!='' && time>=0){
					return time-1
				}
			},
			//获取邮箱验证码
			_handGetCode(){
				this.$api.user.ComitBindPayPalYzmFs({VerifyCode:this.bindEmail.imgCode}).then(res=>{
					console.log(res);
					this.$message.success(res.fsmes)
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
						this.bindEmail.timeshow=true
					}else if(res.fsstate==5){
						this.bindEmail.isCode=true
						this.showCode();
					}
				})
			},
			//下一步
			_handbindEmail(){
				this.btnloading=true
				this.$api.user.ComitUpdateBindPhoneOldAuth({Yzm:this.bindEmail.emailCode}).then(res=>{
					if(res.fsstate!=0){
						this.$message.success(res.fsmes)
					}else{
						this.emailOld=false;
					}
					this.btnloading=false
				}).catch(err=>{
					this.$message.success('Operation failed, please try again!')
					this.btnloading=false
				})
			},
			//获取新邮箱验证码
			onNewCode(){
				let email=this.newEmail.email
				if(email==''){
					this.$message.warning('Enter new email!');
					return;
				}
				
				if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid.');
					return;
				}
				
				this.$api.user.ComitNewBindPhoneYzmFs({Email:email}).then(res=>{
					if(res.fsstate==0){
						this.$message.success(res.fsmes)
						let fssj=res.fssj;
						let fcffssj=res.fcffssj;
						this.newtime=getSecondByDateSub(fssj,fcffssj);
						let timer=setInterval(()=>{
							this.newtime=this.counDown(this.newtime)
							if(this.newtime==0){
								clearInterval(timer);
							}
						},1000)
						this.newEmail.timeshow=true
					}else{
						this.$message.warning(res.fsmes)
					}
				})
			},
			//提交新邮箱验证
			setNewEmail(){
				let email=this.newEmail.email
				if(email==''){
					this.$message.warning('Enter new email!');
					return;
				}
				
				if(!regEmail.test(email)){
					this.$message.warning('The Email is invalid.');
					return;
				}
				let params={
					newphone:email,  //新邮箱
					Yzm:this.bindEmail.emailCode,   //旧邮箱验证码
					Yzm1:this.newEmail.code   //新邮箱验证码
				}
				this.btnloading=true;
				this.$api.user.ComitUpdateBindPhone(params).then(res=>{
					if(res.fsstate != 0){
						this.$message.warning(res.fsmes)
					}else{
						this.$message.success('Bind email to modify successfully.')
						this.$store.dispatch('userInfo/getUserCenterInfo')
						this.$store.dispatch('userInfo/getUserInfo')
						this.emailOld=true;
					}
					this.btnloading=false;
				}).catch(err=>{
					this.$message.warning('Operation failed, please try again!')
					this.btnloading=false;
				})
			},
			//获取用户信息
			async getuserInfo(){
				if(Object.keys(this.userCenterInfo).length==0){
					await this.$store.dispatch('userInfo/getUserCenterInfo')
				};
				let pay= this.userCenterInfo.paypal;
				if(pay!=''){
					let payType=pay.substring(pay.indexOf('[')+1,pay.length-1);
					let payattr=accountAttr.filter(n=>n.text==payType);console.log(payattr)
					Object.assign(this.receipAccount.accountType,payattr[0])
					this.accountType=payType;
					this.receipAccount.account=this.account=pay.substring(0,pay.indexOf('['));
				}
			},
			//修改提交
			onSubmit(){
				//console.log(val)
				this.btnloading=true;
				const {account,accountType}=this.receipAccount
				let params={
					Yzm:'',
					paypal:account,
					ktype:accountType.value
				}
				this.$api.user.ComitBindPayPal(params).then(res=>{
					console.log(res)
					
					this.btnloading=false;
					if(res.fsstate==0){
						this.$message.success(res.fsmes)
						this.accountType=this.receipAccount.accountType.text
						this.account=this.receipAccount.account
						this.$store.dispatch('userInfo/getUserCenterInfo')
					}else{
						this.$message.warning(res.fsmes)
					}
				}).catch(err=>{
					console.log(err)
					this.btnloading=false;
				})
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		display: flex;
		.setting-box{
			flex: 1;
			margin-left: 30px;
			.setting--pass-box{
				width: 600px;
				margin-top: 50px;
			}
			.code-inp{
				width: 200px;
				margin-right: 20px;
			}
			.code-btn{
				padding:8px 15px;
			}
			.receipe-box{
				width: 800px;
				.receipe-head{
					margin-left: 200px;
					.account{
						color: $text-color-brand;
					}
				}
			}
		}
	}
</style>
