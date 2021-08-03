<template>
	<div>
		<Header></Header>
		<div class="coninter" v-if="Object.keys(detail).length>0">
			<dealsDetailed :item="detail" :isDetail="true"></dealsDetailed>
		</div>
		<Footer></Footer>
	</div>
	
</template>

<script>
	export default({
		name:'DealDetail',
		components:{
			dealsDetailed:()=>import('@/components/Deals/detailed.vue')
		},
		data(){
			return{
				rid:this.$route.query.rid,
				detail:{}
			}
		},
		beforeRouteEnter(to,from,next) {
			if(to.query.rid==''){
				next('/dealslist')
			}else{
				next()
			}
		},
		created() {
			this.getDealsInfo();
		},
		methods:{
			async getDealsInfo(){
				this.$loading.load();
				const res=await this.$api.product.getDealsInfo({did:this.rid});
				this.$loading.unLoad();
				if(res.rid=='0'){
					this.$message.warning('Loading error');
					this.$router.push('/dealslist')
				}else{
					res.showCode=false
					this.detail=Object.assign({},this.detail,res);
					this.getDealsListByTypeID({sptype:res.typeid,did:res.rid})
				}
			},
			async getDealsListByTypeID(params){
				const res=await this.$api.product.getDealsListByTypeID(params);
				if(res){
					this.$set(this.detail,'list',res.rows)
				}
			}
		}
	})
</script>

<style>
</style>
