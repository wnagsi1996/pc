<template>
	<div>
		<Header />
		<div class="coninter">
			<div class="product-box">
				<div class="product-lsit">
					<div  v-for="item in productList.rows" :key="item.pid">
						<productItem :item="item" />
					</div>
				</div>
				<div class="pagination">
					<Pagination :total="productList.results" @currentChange="currentChange" />
				</div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import productItem from '@/components/productItem'
	import Pagination from '@/components/Pagination'
	export default({
		name:'ProductList',
		components:{
			productItem,
			Pagination
		},
		data(){
			return{
				typeId:'',
				productList:[],
				pageindex:0
			}
		},
		created() {
			let typeId=this.$route.query.pid;
			if(typeId){
				this.typeId=typeId;
			}else{
				typeId=''
			}
			this.getProductList(typeId);
		},
		beforeRouteUpdate(to, from, next) {
			let typeId=to.query.pid
			if(typeId!=this.typeId){
				this.typeId=typeId;
				this.getProductList(typeId)
			}
			next()
		},
		methods:{
			getProductList(typeId){
				this.$loading.load();
				this.$api.product.loadPDProductList({
					pdtype:-1,
					sptype:'',
					pageindex:this.pageindex
				}).then(res=>{
					this.productList=res;
					this.$loading.unLoad();
				}).catch(err=>{
					console.log(err)
					this.$loading.unLoad();
				})
			},
			currentChange(val){
				this.pageindex=val
				this.getProductList(this.typeId);
			}
		}
	})
</script>

<style lang="scss">
	.coninter{
		.product-box{
			width: 100%;
			max-width: $doc-width;
			margin: 0 auto;
			.product-lsit{
				@include flexBetweeCenter;
				flex-wrap: wrap;
			}
			.pagination{
				margin-top: 20px;
				text-align: right;
			}
		}
	}
</style>
