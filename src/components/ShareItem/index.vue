<template>
	<div class="product-box">
		<div class="status">{{itemData.pdorderstate}}</div>
		<div class="coenter">
			<div class="img">
				<router-link :to="itemData.pdorderno | url">
					<el-image class="el-image" :src="itemData.pimg" fit="scale-down" />
				</router-link>
				
			</div>
			<div class="info">
				<div class="name">{{itemData.ptitle}}</div>
				<div class="attr-num">
					<div class="attr">{{itemData.productattr}}</div>
					<div class="num">x{{itemData.pnum}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default({
		name:'ShareItem',
		props:{
			itemData:Object
		},
		filters:{
			url(orderno){
				return `/groupswait/${orderno}`
			}
		}
	})
</script>

<style scoped lang="scss">
	.product-box{
		width: 480px;
		height: 150px;
		padding:20px;
		border-radius: $border-radius-sm;
		box-shadow: $box-shadow-deep;
		margin:10px 0;
		.status{
			height: 40px;
			color: $text-color-brand;
			font-weight: bold;
		}
		.coenter{
			display: flex;
			.img{
				width: 120px;
				height: 120px;
				cursor: pointer;
				.el-image{
					width: 120px;
					height: 120px;
				}
			}
			.info{
				margin-left: 20px;
				.name{
					@include heightHiddens(2);
				}
				.attr-num{
					margin:10px 0;
					display: flex;
					color:$text-color-three;
					.attr{
						flex:1
					}
					.num{
						width: 50px;
						text-align: right;
					}
				}
			}
		}
	}
</style>
