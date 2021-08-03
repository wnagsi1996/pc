<template>
	<div class="pagination" :style="{textAlign:align}">
		<el-pagination
		  @current-change="currentChange"
		  background
		  :page-sizes="[20]"
		  layout="total, sizes, prev, pager, next, jumper"
		  :hide-on-single-page="true"
		  :total="total">
		</el-pagination>
	</div>
</template>

<script>
	import {Pagination} from 'element-ui'
	export default({
		name:'Pagination',
		props:{
			total:Number,
			align:{
				type:String,
				default:'right'
			},
			isTop:{ //是否需要回到顶部
				type:Boolean,
				default:true
			}
		},
		components:{
			[Pagination.name]:Pagination
		},
		methods:{
			currentChange(val){
				this.$emit('currentChange',val-1);
				console.log(this.isTop)
				if(this.isTop){
					document.documentElement.scrollTop = 0;
				}
			}
		}
	})
</script>

<style scoped>
	.pagination{
		margin-top: 20px;
		width: 100%;
	}
</style>
