<template>
	<div>
		<el-row>
			<el-col :span="6" v-for="item in productList.rows" :key="item.pid">
				<productItem :quickShow="false" :item="item" />
			</el-col>
		</el-row>
		<Pagination :total="productList.pagenum" @currentChange="currentChange" />
	</div>
</template>

<script>
	export default({
		name:'Shop',
		components:{
			Pagination:()=>import('@/components/Pagination'),
			productItem:()=>import('@/components/productItem')
		},
		data(){
			return{
				id:this.$route.params.id,
				pageindex:0,
				productList:{}
			}
		},
		// beforeRouteEnter(to,from,next) {
		// 	if(to.params.id=='' || !to.params.id){
		// 		next(from.path)
		// 	}else{
		// 		next()
		// 	}
		// },
		created() {
			// console.log(this.id)
			this.getProductList()
		},
		methods:{
			async getProductList(){
				this.$loading.load();
				const res=await this.$api.product.getUserStoreProductList({s:this.id,pageindex:this.pageindex});
				this.$loading.unLoad();
				console.log(res)
				if(res.rows.length>0){
					this.productList=res;
				}
			},
			currentChange(val){
				this.pageindex=val
				this.getProductList();
			}
		}
	})
</script>

<style>
</style>
