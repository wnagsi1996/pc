<template>
	<div>
		<div class="content" v-if="content!=''" v-html="content"></div>
		<div class="content" v-else>Store introduction is empty</div>
	</div>
</template>

<script>
	export default({
		name:'ShopDetail',
		data(){
			return{
				id:this.$route.params.id,
				content:''
			}
		},
		created() {
			this.getDetail()
		},
		methods:{
			async getDetail(){
				this.$loading.load();
				const res=await this.$api.product.getUserStoreAboutInfoByStoreID({sid:this.id})
				this.$loading.unLoad();
				this.content=res.sjcontent
			}
		}
	})
</script>

<style>
	.content{
		min-height: 200px;
		margin-top: 20px;
	}
</style>
