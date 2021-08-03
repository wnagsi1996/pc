<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu class="userMenu" />
			<div class="list">
				<ShareItem v-for="item in listObj.rows" :key="item.rid" :itemData="item" />
				<Pagination :total="listObj.results" @currentChange="currentChange" />
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import ShareItem from '@/components/ShareItem'
	import Pagination from '@/components/Pagination'
	import {paginationsMi} from '@/mixins/pagination.js'
	export default({
		name:'MyGifts',
		mixins:[paginationsMi],
		components:{
			userMenu,
			ShareItem,
			Pagination
		},
		methods:{
			//获取免费礼品订单列表
			async load(){
				this.$loading.load()
				const res=await this.$api.user.getUserPDProductList({pdtype:-1,pageindex:this.index});
				if(res.rows.length>0){
					this.listObj=Object.assign({},this.listObj,res)
				}
				this.$loading.unLoad();
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
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin-top: -10px;
			margin-left: 30px;
		}
	}
	
</style>
