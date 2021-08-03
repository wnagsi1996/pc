<template>
	<el-form :model="receipAccount" status-icon ref="receipAccount" class="setting--pass-box receipe-box">
		<div class="receipe-head">
			<p v-if="accountType!=''">Your Current Receipt {{accountType}} Account:<span class="account"> {{account}}</span></p>
			<el-radio-group v-model="receipAccount.accountType.value" style="margin-top: 20px;">
				<el-radio :label="1">PayPal</el-radio>
				<el-radio :label="0">WeChat</el-radio>
				<el-radio :label="2">CashApp</el-radio>
			  </el-radio-group>
		</div>
	   <el-form-item prop="email" style="margin-top: 10px;">
		 <el-input v-model="receipAccount.account" autocomplete="off"></el-input>
	   </el-form-item>
	   <el-form-item>
		 <el-button style="width: 100px;" type="primary" :loading="btnloading" @click="onSubmit">Submit</el-button>
	   </el-form-item>
	</el-form>
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
	import {Form,Input,FormItem,RadioGroup,Radio} from 'element-ui'
	import {mapGetters} from 'vuex'
	export default({
		name:'bindAccount',
		components:{
			[Form.name]:Form,
			[Input.name]:Input,
			[FormItem.name]:FormItem,
			[RadioGroup.name]:RadioGroup,
			[Radio.name]:Radio
		},
		data(){
			return{
				accountType:'',
				account:'',
				receipAccount:{
					accountType:{
						text:'',
						value:0
					},
					account:''
				},
				btnloading:false
			}
		},
		computed:{
			...mapGetters([
				'userCenterInfo'
			])
		},
		created() {
			this.getuserInfo()
		},
		methods:{
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
						this.$emit('closeDialog',true)
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

<style>
</style>
