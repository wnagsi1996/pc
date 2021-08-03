<template>
	<div>
		<Header />
		<div class="coninter">
			<div class="product-box" v-show="productList.results>0">
				<div class="product-lsit">
					<div  v-for="item in productList.rows" :key="item.pid">
						<productItem :item="item" />
					</div>
				</div>
				<Pagination :total="productList.results" @currentChange="currentChange" />
			</div>
			<div v-show="productList.results==0">
				Data empty
			</div>
		</div>
		<Footer />
		
	</div>
</template>

<script>
	import {Dialog} from 'element-ui'
	export default({
		name:'ProductList',
		components:{
			[Dialog.name]:Dialog,
			Pagination:()=>import('@/components/Pagination'),
			productItem:()=>import('@/components/productItem')
		},
		data(){
			return{
				typeId:this.$route.query.pid || '',
				productList:[],
				pageindex:0,
				name:this.$route.query.name || ''
			}
		},
		created() {
			this.getProductList(this.typeId);
		},
		beforeRouteUpdate(to, from, next) {
			console.log(to)
			const {pid,name}=to.query;
			if(pid && name){
				this.typeId=pid;
				this.name=name;
				this.getProductList(this.typeId,this.name)
			}else{
				if(pid){
					this.typeId=pid;
					this.getProductList(this.typeId,'')
				}else if(name){
					this.name=name
					this.getProductList('',this.name)
				}else{
					this.getProductList('','')	
				}
			}
			next()
		},
		methods:{
			getProductList(typeId='',name=''){
				this.$loading.load()
				this.$api.product.searchProduct({
					ifbook:0,
					sptitle:name,
					sptype:typeId,
					ifkq:-1,
					ifjk:-1,
					sorttype:0,
					ifdx:1,
					SellUserID:-1,
					pageindex:this.pageindex
				}).then(res=>{
					this.$loading.unLoad()
					this.productList=res;
				}).catch(err=>{
					this.$loading.unLoad()
					console.log(err)
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
