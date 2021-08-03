<template>
	<div>
		<div class="title">More To Love</div>
		<div class="list-box" v-if="list.length>0">
			<div class="list-item" v-for="(item,index) in list" :key="index" @click="toUrl(item)">
				<div class="img">
					<el-image class="el-img" :src="item.pimg" style="width: 220px;height: 220px;" />
				</div>
				<p>${{item.pjg}}</p>
			</div>
			<div class="list-item" v-for="item in listLength" :key="item+'a'">
				
			</div>
		</div>
	</div>
</template>

<script>
	export default({
		name:'MoreLove',
		props:{
			list:{
				type:Array,
				default:new Array
			}
		},
		computed:{
			listLength(){
				const len=this.list.length;
				return len<=5? 5-len: len%5
				
			}
		},
		methods:{
			toUrl(item){
				this.$router.push({path:`/product?pid=${item.pid}`})
			}
		}
	})
</script>

<style lang="scss" scoped>
	.title{
		font-size: $text-size-lg;
	}
	.list-box{
		margin-top: 10px;
		@include  flexBetweeCenter;
		flex-wrap: wrap;
		.list-item{
			width: 18%;
			margin:20px 0;
			cursor: pointer;
			.img{
				width: 220px;
				height: 220px;
				border: 1px solid $text-color-three;
				border-radius: $border-radius-md;
				overflow: hidden;
			}
			p{
				margin-top: 10px;
			}
		}
	}
</style>
