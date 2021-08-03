<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu />
			<div class="list">
				<div class="money-box">
					<div class="money">
						<div class="node">
							<div class="left">
								<p><span>Remaining:</span><span class="red">{{income.tjyjye}}</span></p>
								<p><span>History:</span><span class="red">{{income.tjyjlj}}</span></p>
							</div>
							<div class="btn">
								<el-button v-if="income.paypal!=''" class="btn" type="primary" size="mini" @click="onCash">Withdraw Cash</el-button>
								<el-button v-else class="btn" type="primary" size="mini" @click="_handBindAccount">Bind Account</el-button>
							</div>
						</div>
						<p><span>Account:</span><span>{{income.paypal}}</span></p>
					</div>
					
				</div>
				<div class="list-box">
					<div class="item-box item-box-blod">
						<div class="name1">Type</div>
						<div class="name2">Money</div>
						<div class="namenull"></div>
						<div class="name3">Time</div>
					</div>
				</div>
				<div class="list-box">
					<div class="item-box" v-for="(item,index) in list.rows" :key="index">
						<div class="name1">{{item.yjlx}}</div>
						<div class="name2">{{item.yjje}}</div>
						<div class="namenull"></div>
						<div class="name3">{{item.wgsj}}</div>
					</div>
				</div>
				<Pagination :total="list.results" @currentChange="currentChange" />
			</div>
		</div>
		<Footer />
		<el-dialog
		  title="Bind Account"
		  :visible.sync="dialogVisible"
		  width="500px"
		  :before-close="handleClose">
		  <bindAccount @closeDialog="closeDialog"></bindAccount>
		</el-dialog>
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import Pagination from '@/components/Pagination'
	import {Dialog} from 'element-ui'
	import {paginationsMi} from '@/mixins/pagination.js'
	export default({
		name:'MyIncome',
		mixins:[paginationsMi],
		components:{
			userMenu,
			Pagination,
			[Dialog.name]:Dialog,
			bindAccount:()=>import('@/components/bindAccount')
		},
		data(){
			return{
				income:0,
				dialogVisible:false
			}
		},
		created() {
			this.getUserTjYj();
		},
		methods:{
			//加载数据
			load(){
				this.$loading.load();
				this.$api.user.getShareYJMXRecordList({pageindex:this.index}).then(res=>{
					if(res!=''){
						this.list=res
					}
					this.$loading.unLoad();
				}).catch(xhr=>{
					console.log(xhr)
					this.$loading.unLoad();
				})
			},
			//获取用户提现佣金
			getUserTjYj(){
				this.$api.user.getUserTjYj().then(res=>{
					if(res!=''){
						this.income=res;
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			//提现
			onCash(){
				let yjye=this.income.tjyjye.substring(1);
				if(yjye<30){  //余额大于30才能提现
					this.$message.warning('Income less than $30 can not be extracted.');
					return;
				}
				
				let paypal=this.income.paypal;
				let accountType=paypal.substring(paypal.indexOf('[')+1,paypal.indexOf(']'));  //截取提现渠道
				paypal=paypal.substring(0,paypal.indexOf('['));
				
				let payInfo=''
				if(accountType=='PayPal'){
					payInfo=',PayPal will charge a fee'
				}
				
				this.$confirm(`Do you confirm withdraw your income to your ${accountType} account: ${paypal} ${payInfo}`, 'Info', {
				  confirmButtonText: 'Confirm',
				  cancelButtonText: 'Cancel',
				  type: 'warning'
				}).then(async () => {
				  const res=await this.$api.user.TjYjTX()
					if(res.fsstate!=0){
						this.$message.warning(res.fsmes)
						if(res.fsstate==2){  //绑定账户
							this.dialogVisible=true;
						}
					}else{
						this.$message.success(res.fsmes)
						this.getUserTjYj();
						this.load()
					}
				})
			},
			_handBindAccount(){
				this.dialogVisible=true;
			},
			closeDialog(){
				this.dialogVisible=false;
				this.index=0;
				this.load()
				this.getUserTjYj();
			},
			handleClose(){
				this.dialogVisible=false;
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		display: flex;
		.list{
			flex: 1;
			margin-left: 30px;
			.money-box{
				margin:0 0 20px;
				box-shadow: $box-shadow-deep;
				padding:20px;
				border-radius: $border-radius-sm;
				display: flex;
				.money{
					display: inline-block;
					vertical-align: top;
					.node{
						display: flex;
						align-items: center;
						.btn{
							margin-left: 10px;
						}
						p{
							margin: 10px 0;
							span:first-child{
								width: 100px;
								display: inline-block;
							}
							.red{
								color:$text-color-brand;
								font-weight: bold;
							}
						}
					}
					
				}
				.btn{
					height: 40px;
					display: inline-block;
				}
				
			}
			.list-box{
				.item-box{
					display: flex;
					align-items: center;
					border-bottom: 1px solid #f7f7f7;
					padding: 10px 0;
					.name1{
						width: 300px;
					}
					.name2{
						width: 200px;
					}
					.name3{
						width: 150px;
						float: right;
					}
					.namenull{
						flex: 1;
					}
				}
				.item-box-blod{
					font-weight: bold;
				}
			}
			
		}
	}
</style>
