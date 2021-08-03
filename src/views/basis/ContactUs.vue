<template>
	<div>
		<Header />
		<div class="container">
			<div class="message-box">
				<el-form label-position="top">
					<el-form-item label="Email">
						 <el-input v-model.trim="form.email"></el-input>
					</el-form-item>
					<el-form-item label="Message">
						 <el-input type="textarea" rows="4" :autosize="{ minRows: 2, maxRows: 6 }" v-model.trim="form.txt"></el-input>
					</el-form-item>
					<el-form-item label="Code">
						 <div class="code-box">
							 <el-input class="inp" v-model.trim="form.code"></el-input>
							 <img src="" alt="" id="codeimg" style="height: 40px;">
						 </div>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="_handSubmit" :loading="loading">Submit</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import {Form,FormItem,Input} from 'element-ui'
	import {regEmail} from '@/utlis/regular.js'
	export default({
		name:'ContactUs',
		components:{
			[Form.name]:Form,
			[FormItem.name]:FormItem,
			[Input.name]:Input
		},
		data(){
			return{
				form:{
					email:'',
					txt:'',
					code:''
				},
				loading:false
			}
		},
		mounted() {
			this.showCode()
		},
		methods:{
			_handSubmit(){
				const {email,txt,code}=this.form;
				if(email==''){
					this.$message.warning('Enter Email')
					return ;
				}else if(!regEmail.test(email)){
					this.$message.warning('Incorrect email format')
					return;
				}
				if(txt==''){
					this.$message.warning('The content can not be blank');
					return
				}
				if(code==''){
					this.$message.warning('Enter Code');
					return
				}
				this.loading=true;
				this.$api.product.ComiitSuggest({
					suggestContent:txt,
					suggestLxfs:email,
					yzm:code
				}).then(res=>{
					if(res.fsstate==0){
						this.$message.success(res.fsmes);
						let form=this.form
						Object.keys(form).forEach(n=>(form[n]=''));
						this.form=form
					}else{
						this.$message.warning(res.fsmes);
					}
					this.loading=false
				}).catch(err=>{
					console.log(err);
					this.loading=false
				})
			},
			//获取图片验证码
			showCode(){
				let url=""
				process.env.NODE_ENV==='development'?url="/Handler":url='';  //区分开发环境加‘/Handler’，生产环境不加
				document.getElementById('codeimg').src=url+'/UserControl/Validata.aspx?ValiType=valiregister&' + Math.random();
			}
		}
	})
</script>

<style lang="scss" scoped>
	.message-box{
		width: 500px;
		margin:50px auto;
		.code-box{
			display: flex;
			.inp{
				width: 150px;
			}
			#codeimg{
				width: 100px;
			}
		}
	}
</style>
