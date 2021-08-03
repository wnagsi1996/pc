<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu class="userMenu" />
			<div class="list">
				<div class="tabs">
					<el-tabs v-model="vtype" stretch @tab-click="handleClick">
					    <el-tab-pane label="All" name="-1" />
					    <el-tab-pane label="Unuser" name="0" />
					    <el-tab-pane label="Used" name="1" />
					    <el-tab-pane label="Expired" name="2" />
					</el-tabs>
				</div>
				<div v-show="listObj.rows">
					<el-row :gutter="20">
						<el-col :span="12" v-for="(item,index) in listObj.rows" :key="index">
							<CouponItem :couponData="item" />
						</el-col>
					</el-row>
					<Pagination :total="listObj.results" @currentChange="currentChange" />
				</div>
			
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import Pagination from '@/components/Pagination'
	import {Tabs,TabPane} from 'element-ui'
	import CouponItem from '@/components/CouponItem'
	import {paginationsMi} from '@/mixins/pagination'
	export default({
		name:'MyCoupon',
		mixins:[paginationsMi],
		components:{
			userMenu,
			Pagination,
			CouponItem,
			[Tabs.name]:Tabs,
			[TabPane.name]:TabPane
		},
		data(){
			return{
				vtype:'0',
				status:'0'
			}
		},
		methods:{
			//获取免费礼品订单列表
			async load(pageindex){
				this.$loading.load()
				const res=await this.$api.user.getVoucher({vtype:this.vtype,pageindex:this.index});
				if(res.rows.length>0){
					this.listObj=res;
				}else{
					this.listObj={}
				}
				this.$loading.unLoad();
			},
			handleClick(e){
				if(this.status!=this.vtype){
					this.status=this.vtype
					this.load(0)
				}
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		margin:20px auto;
		display: flex;
		.list{
			flex: 1;
			margin-top: -10px;
			margin-left: 30px;
		}
	}
	
</style>
