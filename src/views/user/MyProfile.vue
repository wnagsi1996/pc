<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu />
			<div>
				<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="200px" class="el-form">
					<el-form-item label="Profile" >
						<div class="upload-item">
							<el-avatar shape="square" :size="50" fit="scale-down" :src="headimg">
								<!-- //图片加载失败 -->
								<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
							</el-avatar>
							<el-button class="upload-btn" size="small" type="primary" @click="_handShowUpload">Upload</el-button>
						</div>
						
					</el-form-item>
					<el-form-item label="Family name" prop="family">
						<el-input v-model="ruleForm.family" readonly></el-input>
					</el-form-item>
					<el-form-item label="Nick name" prop="nick">
						<el-input v-model="ruleForm.nick"></el-input>
					</el-form-item>
					<el-form-item label="Sex" prop="sex">
						<el-radio-group v-model="ruleForm.sex">
						    <el-radio :label="1">Male</el-radio>
						    <el-radio :label="0">Famale</el-radio>
						    <el-radio :label="2">Secrecy</el-radio>
						  </el-radio-group>
					</el-form-item>
					<el-form-item label="Alternate mailbox" prop="email">
						<el-input v-model="ruleForm.email"></el-input>
					</el-form-item>
					<el-form-item label="Personal statement" prop="statement">
						<el-input type="textarea" rows="3" v-model="ruleForm.statement"></el-input>
					</el-form-item>
					<el-form-item >
						<el-button class="btn" type="primary" :loading="loading" @click="onSubmit">Save</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<Footer />
		<el-dialog
		  title="Upload Avatar"
		  :visible.sync="dialogVisible"
		  width="800px"
		  :before-close="handleClose">
		  <div>
			  <comment :is="uploadCom" ref="uploadImage" @dialogClose="handleClose"></comment>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import {Form,Input,Radio,RadioGroup,FormItem,Avatar,Dialog} from 'element-ui'
	import {mapGetters,mapActions} from 'vuex'
	import {regEmail} from '@/utlis/regular.js'
	export default({
		name:'MyProfilt',
		components:{
			userMenu,
			[Form.name]:Form,
			[Input.name]:Input,
			[Radio.name]:Radio,
			[RadioGroup.name]:RadioGroup,
			[Avatar.name]:Avatar,
			[FormItem.name]:FormItem,
			[Dialog.name]:Dialog
		},
		data(){
			const checkEmail=(rule, value, callback)=>{
				if (!value) {
				  return callback(new Error('Enter Email'))
				}
				setTimeout(() => {
				  if (regEmail.test(value)) {
					callback()
				  } else {
					callback(new Error('Email format is incorrect'))
				  }
				}, 100)
			}
			return{
				ruleForm:{
					family:'',
					nick:'',
					sex:'',
					email:'',
					statement:''
				},
				rules:{
					nick:[
						{ required: true, message: 'Enter Nick Name', trigger: 'blur' },
						{ min: 6, max: 30, message: '3 to 5 characters in length', trigger: 'blur' }
					],
					sex:[
						{ required: true, message: 'Select Sex', trigger: 'blur' }
					],
					email:[
						{ required: true, message: 'Enter Email', trigger: 'blur' },
						{ validator: checkEmail, trigger: 'blur' }
					]
				},
				headimg:'',
				loading:false,
				dialogVisible:false,
				uploadCom:null
			}
		},
		computed:{
			...mapGetters([
				'userCenterInfo'
			])
		},
		created() {
			this.setUserInfo()
		},
		methods:{
			async setUserInfo(){
				if(Object.keys(this.userCenterInfo).length==0){
					await this.getUserInfo();
				}
				const {name,ncname,sex,loginname,headimg,gxqm}=this.userCenterInfo;
				Object.assign(this.ruleForm,{
					family:name,
					nick:ncname,
					email:loginname,
					statement:gxqm,
					sex
				})
				this.headimg=headimg;
			},
			//提交修改
			onSubmit(){
				 this.$refs.ruleForm.validate((valid) => {
					 if(valid){
						 this.loading=true;
						 const {family,nick,sex,email,statement}=this.ruleForm;
						 let params={
						 	name:family,
						 	nickname:nick,
						 	sex,
						 	bylxfs:email,
						 	gxqm:statement,
						 	college:this.userCenterInfo.college
						 }
						 this.$api.user.savePersonInfo(params).then(res=>{
						 	if(res=='1'){
						 		this.$message.success('Modify Success!');
						 		this.getUserInfo()
						 	}else{
						 		if(res=='0'){
						 			this.$message.warning('Modify Failed!');
						 		}else{
						 			this.$message.warning(res);
						 		}
						 	}
						 	this.loading=false;
						 }).catch(err=>{
						 	console.log(err)
						 	this.loading=false;
						 })
					 }
				 })
				
			},
			...mapActions({
				getUserInfo:'userInfo/getUserCenterInfo'
			}),
			handleClose(type=false){
				this.dialogVisible=false;
				if(type) this.setUserInfo();
			},
			_handShowUpload(){
				this.dialogVisible=true;
				if(this.uploadCom==null){
					this.uploadCom=()=>import("@/components/UploadImage")
				}
				
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		display: flex;
		.el-form{
			width: 600px;
			.upload-item{
				display: flex;
				align-items: center;
				.upload-btn{
					margin-left: 10px;
					@include buttonBrandfu;
					padding:8px 12px;
				}
			}
			.btn{
				width: 100%;
			}
		}
	}
</style>
