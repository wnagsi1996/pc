<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu class="userMenu" />
			<div class="order-box">
				<div class="tabs">
					<el-tabs v-model="status.text" stretch @tab-click="handleClick">
					    <el-tab-pane label="All" name="All" />
					    <el-tab-pane label="Pending" name="Pending" />
					    <el-tab-pane label="Processing" name="Processing" />
					    <el-tab-pane label="Shipping" name="Shipping" />
					    <el-tab-pane label="Completed" name="Completed" />
					    <el-tab-pane label="Close" name="Close" />
					    <el-tab-pane label="Sharing" name="Sharing" />
					</el-tabs>
				</div>
				<template v-show="listObj.rows.length>0">
					<div class="list-box">
						<div class="item-box" v-for="item in listObj.rows" :key="item.ddbh">
							<div class="order-header">
								<div class="order-type" v-if="item.type">
									<img src="../../assets/image/two-man.png" alt="">
								</div>
								<div class="content">
									<div class="item">Order ID:<span>{{item.ddbh}}</span></div>
									<div class="item">Order time:<span>{{item.ddxdsj}}</span></div>
									<div class="item">Order status:<span>{{item.ddzt | state}}</span></div>
									<div class="item">Total price:<span>${{item.ddje}}</span></div>
									<div class="item" v-if="item.ddfksj">Pay time:<span>{{item.ddfksj}}</span></div>
								</div>
							</div>
							<div class="btn">
								<el-button size="mini" @click="hankDetail(item.ddbh)">Order Detail</el-button>
							</div>
							<div class="order-detail" v-if="item.isShow">
								<div class="order-detail-box" v-for="n in item.children" :key="n.wlorderno">
									<div class="detail-img">
										<router-link :to="n | url">
											<el-image class="el-image" :src="n.ddmximg" />
										</router-link>
										
									</div>
									<div class="info">
										<div class="title">{{n.ddmxtitle}}</div>
										<div class="item">Price:${{n.ddmxdj}}</div>
										<div class="item">Quantity:{{n.ddmxnum}}</div>
										<div class="item">Total price:{{Number(n.ddmxdj)*Number(n.ddmxnum)}}</div>
										
									</div>
								</div>
								<div class="total">Total Quantity:{{item.totalNum}},Prices:${{item.totalPrice}}</div>
								<div class="btn">
									<el-button v-if="item.ddzt=='0'" type="primary" size="mini" @click="hankCancel(item.ddbh)">Cancel order</el-button>
									<el-button v-if="item.ddzt=='0'" type="primary" size="mini" @click="hankPay(item.ddbh)">Pay order</el-button>
									<el-button v-if="item.ddzt=='2'" type="success" size="mini" @click="hankConfirm(item.ddbh)">Confirm Receipt</el-button>
								</div>
							</div>
						</div>
					</div>
					<Pagination :total="listObj.results" @currentChange="currentChange" />
				</template>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	//状态
	const stateJson=[
		{
			val:'',
			text:'All'
		},
		{
			val:'0',
			text:'Pending'
		},
		{
			val:'1',
			text:'Processing'
		},
		{
			val:'2,9',
			text:'Shipping'
		},
		{
			val:'3,4,5',
			text:'Completed'
		},
		{
			val:'8',
			text:'Close'
		},
		{
			val:'10',
			text:'Sharing'
		}
	]
	import userMenu from '@/components/userMenu'
	import {Tabs,TabPane} from 'element-ui'
	import Pagination from '@/components/Pagination'
	import {paginationsMi} from '@/mixins/pagination.js'
	export default({
		name:'myOrder',
		mixins:[paginationsMi],
		components:{
			userMenu,
			Pagination,
			[Tabs.name]:Tabs,
			[TabPane.name]:TabPane
		},
		data(){
			return{
				status:{
					text:'All',
					val:''
				},
				detailList:{},  //存放点击的订单详情列表
				total:{}
			}
		},
		methods:{
			//加载数据
			load(){
				this.$loading.load();
				this.$api.user.getMySCSaleList({ddzt:this.status.val,pageindex:this.index}).then(res=>{
					if(res.rows.length!=0){
						res.rows.forEach((n,i)=>{
							if(n.ddbh.startsWith('PT')){
								n.type=true
							}else{
								n.type=false
							}
							n.isShow=false
						})
						this.listObj=res
					}else{
						this.listObj={};
					}
					this.$loading.unLoad();
				}).catch(err=>{
					this.$message.error('Data loading error')
					this.$loading.unLoad();
				})
			},
			//查看详情
			async hankDetail(orderno){
				let attr=[]
				if(!this.detailList[orderno]){
					this.$loading.load();
					const res=await this.$api.user.getMySCSaleDetailList({orderno,ddzt:''})
					this.$loading.unLoad();
					if(res.rows!=''){
						this.$set(this.detailList,orderno,res.rows);
						attr=this.detailList[orderno];
					}
				}else{
					attr=this.detailList[orderno];
				}
				
				let [totalPrice,totalNum]=[0,0]
				attr.forEach(n=>{
					totalNum+=Number(n.ddmxnum);
					totalPrice+=Number(n.ddmxdj)*Number(n.ddmxnum)
				})
				this.listObj.rows.forEach(n=>{
					if(n.ddbh==orderno){
						n.children=attr
						n.isShow=!n.isShow
						n.totalPrice=totalPrice
						n.totalNum=totalNum
					}
				})
			},
			//点击分类
			handleClick(tab, event){
				const {name,label}=tab;
				let status={}
				stateJson.forEach(n=>{
					if(n.text==name){
						status.text=n.text;
						status.val=n.val
					}
				});
				this.status=status;
				this.index=0;
				this.load()
			},
			//取消订单
			hankCancel(orderno){
				this.$confirm('Are you sure want to cancel the order?', 'Prompt', {
				  confirmButtonText: 'Yes',
				  cancelButtonText: 'No',
				  type: 'warning'
				}).then(async () => {
				  const res=await this.$api.user.cancelSCOrder({orderno})
				  if(res.fsstate=='1'){
					  this.$message.success('Order canceled');
					  this.load();
				  }else{
					  this.$message.error(res.fsmes);
				  }
				}).catch(() => {})
			},
			//支付订单
			hankPay(orderno){
				this.$api.user.doPaySCOrder({orderno}).then(res=>{
					if(res!=''){
						if(res.fsstate==1){
							//paypal支付
							if(res.fzffs==2){
								window.location.href = res.fsmes;
							}else{
								//微信支付
								if(res.fzffs==1){
									
								}
							}
						}else{
							this.$message.error(res.fsmes)
						}
					}else{
						this.$message.error('operation exception .please try again.')
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			//确认收货
			hankConfirm(orderno){
				this.$confirm('Are you sure that you have received all the products in this order?', 'Prompt', {
				  confirmButtonText: 'Yes',
				  cancelButtonText: 'No',
				  type: 'warning'
				}).then(async () => {
				  const res=await this.$api.user.comitshTotalOrder({orderno})
				  if(res.fsstate=='1'){
					  this.$message.success('Receipt success');
					  this.load();
				  }else{
					  this.$message.error(res.fsmes);
				  }
				}).catch(() => {})
			}
		},
		filters:{
			state(val){
				let check=stateJson.find(n=>n.val.includes(val));console.log(check)
				if(check){
					return stateJson.find(n=>n.val.includes(val)).text
				}else{
					return val;
				}
				
			},
			orderType(orderno){
				return orderno.startsWith('PT')?true:false
			},
			url(item){
				return `/product?pid=${item.ddpid}`
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		display: flex;
		.order-box{
			flex: 1;
			margin-left: 30px;
			.list-box{
				margin-top: 20px;
				.item-box{
					margin:30px 0;
					.order-header{
						padding:10px;
						background-color: $bj-color-gray;
						display: flex;
						flex-wrap: wrap;
						align-items: center;
						.order-type{
							width: 70px;
							text-align: center;
							img{
								width: 40px;
							}
						}
						.content{
							flex: 1;
							display: flex;
							flex-wrap: wrap;
							.item{
								
								padding:4px 50px 4px 0;
								span{
									color:$text-color-three;
								}
							}
						}
					}
					.btn{
						text-align: right;
						margin-top: 10px;
					}
					.order-detail{
						.order-detail-box{
							display: flex;
							margin:20px 0;
							.detail-img{
								width: 150px;
								height: 150px;
								.el-image{
									width: 150px;
									height: 150px;
								}
							}
							.info{
								flex: 1;
								margin-left: 20px;
								.item{
									color: $text-color-two;
									padding:5px 0 0;
								}
							}
						}
						.total{
							text-align: right;
							color: $text-color-brand;
						}
					}
				}
			}
		}
	}
	
</style>
