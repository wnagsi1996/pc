<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu />
			<div class="list">
				<div class="list-box">
					<div class="item-box item-box-blod">
						<div class="name1">Type</div>
						<div class="name2">Title</div>
						<div class="name3">Time</div>
						<div class="name4">Operating</div>
					</div>
				</div>
				<div class="list-box">
					<div class="item-box" v-for="(item,index) in showlist" :key="index">
						<div class="name1">{{item.flb | type}}</div>
						<div class="name2">{{item.fntitle}}</div>
						<div class="name3">{{item.frq}}</div>
						<div class="name4 del" @click="_handDel(item.nid)"><i class="el-icon-delete"></i></div>
					</div>
				</div>
				<Pagination :total="list.results" @currentChange="currentChange" />
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import Pagination from '@/components/Pagination'
	import {paginationsMi} from '@/mixins/pagination.js'
	export default({
		name:'MyIncome',
		mixins:[paginationsMi],
		components:{
			userMenu,
			Pagination
		},
		data(){
			return{
				showlist:[]
			}
		},
		methods:{
			//加载数据
			load(){
				this.$loading.load();
				this.$api.user.getUserNoticeList().then(res=>{
					console.log(res)
					if(res.rows.length>0){
						this.list=res
						this.showlist=res.rows.slice(0,19)
					}else{
						this.list=[]
					}
					this.$loading.unLoad();
				}).catch(xhr=>{
					console.log(xhr)
					this.$loading.unLoad();
				})
			},
			_handDel(nid){
				this.$confirm('Confirm delete?', '', {
				  confirmButtonText: 'Yes',
				  cancelButtonText: 'No',
				  type: 'warning'
				}).then(() => {
				  
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '已取消删除'
				  });          
				});
			},
			currentChange(val){
				this.showlist=this.list.rows.slice(val*20,(val+1)*20)
			}
		},
		filters:{
			type(n){
				if(n=='1'){
					return 'System Messages'
				}else{
					return 'General messages'
				}
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
					p:not(:last-child){
						margin-bottom: 5px;
					}
					p{
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
					div{
						padding:0 10px;
					}
					.name1{
						width: 200px;
					}
					.name2{
						flex:1;
					}
					.name3{
						width: 150px;
					}
					.name4{
						width: 100px;
					}
					.del{
						cursor: pointer;
						text-align: center;
					}
				}
				.item-box-blod{
					font-weight: bold;
				}
			}
			
		}
	}
</style>
