<template>
	<div>
		<div>
			<div v-if="listshow">
				<el-row :gutter="12">
					<el-col class="col-node" :span="12">
						<el-card shadow="never">
							<div class="cart-body cart-body-null" @click="_handSedAddress()">
								<i class="el-icon-plus"></i>
							</div>
						</el-card>
					</el-col>
					<el-col class="col-node" :span="12" v-for="item in list" :key="item.rid">
						<AddressInfo :infodata="item" :pddz="true" @editaddress="_handSedAddress" @deladdress="_handDeladdress"
						@defaultaddress="_handDefaultaddress" @setAddress="_handSetAddress"></AddressInfo>
					</el-col>
				</el-row>
			</div>
			<el-form v-else label-position="top" :rules="addressRules" :model="addressFrom" ref="addressFrom" class="demo-form-inline">
				<div class="back" v-if="!listshow && pdorderno!=''"><el-button type="primary" size="small" icon="el-icon-back" @click="_handback">后退</el-button></div>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="First name:" prop="firstName">
						  <el-input v-model="addressFrom.firstName" placeholder="First name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Last name:" prop="lastName">
						  <el-input v-model="addressFrom.lastName" placeholder="Last name"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			  <el-form-item label="Street/Address:" prop="street">
			    <el-input v-model="addressFrom.street" placeholder="Street/Address"></el-input>
			  </el-form-item>
			  <el-row :gutter="20">
			  	<el-col :span="12">
			  		<el-form-item label="City:" prop="city">
			  		  <el-input v-model="addressFrom.city" placeholder="City"></el-input>
			  		</el-form-item>
			  	</el-col>
				<el-col :span="12">
						<el-form-item label="province:" prop="province">
							<el-select v-model="addressFrom.province" @focus="_handProvinceChange" placeholder="province" style="width: 320px;">
								<el-option
								  v-for="(item,value) in province"
								  :key="value"
								  :label="item"
								  :value="value"
								  >
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
			  	<el-col :span="12">
			  		<el-form-item label="country:" prop="country">
						<el-select v-model="addressFrom.country" @change="_handCountryFocus" placeholder="country" style="width: 320px;">
							<el-option
							  v-for="(item,value) in country"
							  :key="value"
							  :label="item"
							  :value="value"
							  >
							</el-option>
						</el-select>
			  		</el-form-item>
			  	</el-col>
				
				
			  	<el-col :span="12">
			  		<el-form-item label="Phone number:" prop="phone">
			  		  <el-input v-model="addressFrom.phone" placeholder="Phone number:"></el-input>
			  		</el-form-item>
			  	</el-col>
			  </el-row>
			  <el-row :gutter="20">
			  	<el-col :span="12">
			  		<el-form-item label="ZIP/Postal code:" prop="zip">
			  		  <el-input v-model="addressFrom.zip" placeholder="ZIP/Postal code"></el-input>
			  		</el-form-item>
			  	</el-col>
			  	<el-col :span="12">
			  		<el-form-item label="SNS Account:(webchat\FB\Email)Optional:">
			  		  <el-input v-model="addressFrom.sns" placeholder="SNS Account:(webchat\FB\Email)Optional"></el-input>
			  		</el-form-item>
			  	</el-col>
			  </el-row>
			  <el-checkbox v-model="checked">Set Default</el-checkbox>
			  <el-button class="btnsave" type="primary" :loading="btnLoading" @click="onSubmit('addressFrom')">Save</el-button>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {Form,FormItem,Input,Select,Option,Checkbox,Card} from 'element-ui'
	import {country_arr,province_arr} from '@/assets/js/global.js'
	import {address} from '@/mixins/address.js'
	export default({
		name:'AddressItem',
		mixins:[address],
		components:{
			[Form.name]:Form,
			[FormItem.name]:FormItem,
			[Input.name]:Input,
			[Select.name]:Select,
			[Checkbox.name]:Checkbox,
			[Option.name]:Option,
			[Card.name]:Card,
			AddressInfo:()=>import('@/components/AddressInfo')
		},
		props:{
			addressId:String,  //传过来的id，有传是编辑，传空是创建
			pdorderno:{  //判断是否是拼单页面打开得
				type:String,
				default:''
			}
		},
		
		data(){
			//验证手机号码
			var isMobileNumber= (rule, value, callback) => {
			   if (!value) {
				return new Error("Enter Phone Number");
			  } else {
				const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
				const isPhone = reg.test(value);
				value = Number(value); //转换为数字
				if (typeof value === "number" && !isNaN(value)) {//判断是否为数字
				value = value.toString(); //转换成字符串
				  if (value.length < 0 || value.length > 12 || !isPhone) { //判断是否为11位手机号
					callback(new Error("Wrong format of phone number"));
				  } else {
					callback();
				  }
				} else {
				  callback(new Error("Only pure numbers can be entered"));
				}
			  }
			 };
			return{
				addressFrom:{
					firstName:'',
					lastName:'',
					street:'',
					city:'',
					country:'', //国家
					province:'', //省
					phone:'',
					zip:'',
					sns:'',
					addressid:''
				},
				addressRules:{
					firstName:[
						{ required: true, message: 'Enter First Name', trigger: 'blur' }
					],
					lastName:[
						{ required: true, message: 'Enter Last Name', trigger: 'blur' }
					],
					street:[
						{ required: true, message: 'Enter Street', trigger: 'blur' }
					],
					city:[
						{ required: true, message: 'Enter City', trigger: 'blur' }
					],
					country:[
						{ required: true, message: 'Select Country', trigger: 'blur' }
					],
					province:[
						{ required: true, message: 'Select Province', trigger: 'blur' }
					],
					phone:[
						{ required: true, message: 'Enter Phone Number', trigger: 'blur' },
						{ validator: isMobileNumber, trigger: "blur" }
					],
					zip:[
						{ required: true, message: 'Enter ZIP/Postal code:', trigger: 'blur' }
					]
				},
				province:[],
				country:country_arr,
				rid:0,  //新增就0，编辑就用传过来的参数
				checked:true,  //默认收货地址
				btnLoading:false,
				listshow:this.pdorderno!=''?true:false, //列表得显示隐藏
				pid:''//地址id
			}
		},
		created() {
			if(this.addressId!='' && this.addressId){
				this.rid=this.addressId
				this.getAddressInfo();
			}
			if(this.listshow){
				this.getAddressList()
			}
		},
		methods:{
			//获取地址数据
			getAddressInfo(){
				this.$api.user.GetAddressByAddressID({addressid:this.rid}).then(res=>{
					//console.log(res);
					if(res!=''){
						Object.assign(this.addressFrom,res);
						this.addressFrom={
							firstName:res.firstname,
							lastName:res.lastname,
							street:res.address,
							city:res.city,
							province:res.province,
							country:res.county,
							phone:res.lxfs,
							zip:res.Postcode,
							sns:res.sns,
							addressid:res.addressid
						}
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			//选中城市先判断国家有没有选
			_handProvinceChange(){
				if(this.country.length==0){
					this.$message.warning('Select Province')
				}
			},
			//国家选择变化
			_handCountryFocus(val){
				let attr=province_arr[val+1];
				this.province=attr.split('|')
				
			},
			//提交
			onSubmit(formName){
				this.$refs[formName].validate((valid)=>{
					if (valid) {
						this.btnLoading=true;
						let addressFrom=this.addressFrom;
						let {province,country}=addressFrom;
					
						let params={
							bjdzrid:this.rid,
							firstname:addressFrom.firstName,
							lastname:addressFrom.lastName,
							lxfs:addressFrom.phone,
							postcode:addressFrom.zip,
							country:this.country[country]?this.country[country]:country,
							state:this.province[province]?this.province[province]:province,
							city:addressFrom.city,
							xxdz:addressFrom.street,
							mrdz:this.checked?1:0,
							sns:addressFrom.sns
						}
						this.$api.user.AddAddress(params).then(res=>{
							console.log(res)
							if(res.fsstate=='0'){
								this.$message.success(res.fsmes)
								//不是拼单页面直接关闭，拼单页面不关闭
								if(this.pdorderno==''){
									this.$emit('updateAddress',true)
								}else{
									this._handback()
									this.getAddressList()
								}
							}else{
								this.$message.warning(res.fsmes)
							}
							this.btnLoading=false
						}).catch(err=>{
							this.$message.warning('Fail')
							console.log(err);
							this.btnLoading=false
						})
					  } else {
						console.log('error submit!!');
						return false;
					  }
				})
			},
			//设置地址
			_handSedAddress(rid=''){
				this.listshow=false;
				
				if(rid!=''){
					this.rid=rid;
					this.getAddressInfo();
				}else{
					this.rid=0;
				}
			},
			_handback(){
				this.listshow=true;
				let addressFrom=this.addressFrom
				Object.keys(addressFrom).forEach(item=>addressFrom[item]='');
				this.addressFrom=addressFrom;
				this.rid=0
			},
			async _handSetAddress(addrid){
				console.log(addrid)
				const res=await this.$api.user.setPDAddress({orderno:this.pdorderno,addrid});
				console.log(res)
				if(res!='0'){
					this.$emit('updateAddress',true)
				}
			}
		},
		watch:{
			addressId(newVal){
				if(newVal!=''){
					this.rid=this.addressId
					this.getAddressInfo();
				}else{
					this.rid=0;
					let addressFrom=this.addressFrom;
					Object.keys(addressFrom).forEach(item=>addressFrom[item]='');
					this.addressFrom=addressFrom;
				}
				
			}
		}
	})
</script>

<style lang="scss" scoped>
	.btnsave{
		width: 150px;
		margin: 0 auto;
		display: block;
	}
	.col-node{
		margin: 0 0 16px;
		.cart-body-null{
			height: 156px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			.el-icon-plus{
				font-size: $text-size-2x;
				color:$text-color-three;
			}
		}
	}
	.back{
		font-size: $text-size-md;
	}
	.cart-body{
		.flex{
			display: flex;
			align-items: center;
			margin:4px 0;
			line-height: 24px;
			p{
				padding-right: 10px;
				&.red{
					color:$text-color-brand;
				}
			}
		}
	}
	.btn{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.link{
			margin-left: 20px;
		}
	}
</style>
