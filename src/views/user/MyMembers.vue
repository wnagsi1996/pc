<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu />
			<div class="list">
				<el-row :gutter="12">
					<el-col class="member-item" :span="12" v-for="item in list.rows" :key="item.hyid">
						<el-card shadow="never">
							<div class="member-box">
								<div class="img-box">
									<el-image class="img" :src="item.headimg"></el-image>
								</div>
								<div class="info">
									<p>{{item.yhname}}</p>
									<p>2 Level Member:{{item.hy2}}</p>
									<p>{{item.zcsj}}</p>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<Pagination :total="list.results" @currentChange="currentChange" />
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import Pagination from '@/components/Pagination'
	import {paginationsMi} from '@/mixins/pagination'
	import {Card} from 'element-ui'
	export default({
		name:'MyMembers',
		mixins:[paginationsMi],
		components:{
			userMenu,
			Pagination,
			[Card.name]:Card
		},
		
		methods:{
			//加载数据
			load(){
				this.$loading.load();
				this.$api.user.getShareYQRecordList({pageindex:this.index}).then(res=>{
					if(res!=''){
						this.list=res
					}
					this.$loading.unLoad();
				}).catch(xhr=>{
					console.log(xhr)
					this.$loading.unLoad();
				})
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
			.member-item{
				margin:0 0 16px;
				.member-box{
					display: flex;
					.img-box{
						width: 80px;
						height: 80px;
						.img{
							width: 80px;
							height: 80;
						}
					}
					.info{
						flex:1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 10px;
					}
				}
			}
			
		}
	}
</style>
