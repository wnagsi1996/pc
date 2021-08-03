<template>
	<div>
		<Header></Header>
		<div class="coninter">
			<div class="title">How To Get Free Gifts</div>
			<el-image v-for="(item,index) in list" :key="index" :src="item"></el-image>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
	export default({
		name:'HowToGetFreeGifts',
		data(){
			return{
				list:[
					require('../../assets/image/des01.jpg'),
					require('../../assets/image/des02.jpg'),
					require('../../assets/image/des03.jpg'),
					require('../../assets/image/des04.jpg'),
					require('../../assets/image/des05.jpg')
				]
			}
		}
	})
</script>

<style lang="scss" scoped>
	.title{
		font-size: $text-size-lg;
		text-align: center;
	}
</style>
