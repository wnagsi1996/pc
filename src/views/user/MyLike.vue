<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu class="userMenu" />
			<div class="list">
				<div class="list-box" v-for="item in list.rows" :key="item.spid" @click="_handToUrl(item.sptitle,item.spid)">
					<el-image class="el-image" :src="item.pimg" fit="scale-down"></el-image>
					<p>{{item.sptitle}}</p>
					<div class="item">
						<span>${{item.spjg}}</span>
						<i class="el-icon-delete" @click="_handDel(item.spid)"></i>
					</div>
				</div>
				<div class="list-box" v-for="(item,index) in divNul" :key="index"></div>
				<Pagination :total="list.results" @currentChange="currentChange" />
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import ShareItem from '@/components/ShareItem'
	import Pagination from '@/components/Pagination'
	export default({
		name:'MyLike',
		components:{
			userMenu,
			ShareItem,
			Pagination
		},
		data(){
			return{
				list:{},
				index:0
			}
		},
		computed:{
			divNul(){
				if(this.list.rows){
					let len=this.list.rows.length;
					return 4-(len%4);
				}
				return 0;
			}
		},
		created() {
			this.getUserPDProductList(this.index);
		},
		methods:{
			//获取列表
			async getUserPDProductList(pageindex){
				this.$loading.load();
				const res=await this.$api.user.getUserSCFocusSaleList({pageindex});
				if(res.rows.length>0){
					this.list=res;
				}
				this.$loading.unLoad();
			},
			//删除
			_handDel(pid){
				this.$api.user.cancelFocus({pid}).then(res=>{
					if(res=='2'){
						this.$message.success('success');
						// this.list.rows=this.list.rows.filter(n=>n.spid!=pid);
						this.getUserPDProductList(this.index);
					}else{
						if(res=='0'){
							this.$message('Fuccess')
						}else{
							this.$message(res)
						}
					}
				})
			},
			//跳转
			_handToUrl(title,pid){
				console.log(pid)
				this.$router.push('/product?pid='+pid)
			},
			//分页
			currentChange(val){
				this.idnex=val
				this.getUserPDProductList(val)
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
			.list-box{
				.el-image{
					width: 250px;
					height: 250px;
					cursor: pointer;
				}
				width: 250px;
				margin:20px 0;
				p{
					@include heightHiddens(2)
					cursor: pointer;
					&:hover{
						color:$text-color-brand;
					}
				}
				.item{
					@include flexBetweeCenter;
					span{
						color:$text-color-brand;
					}
					i{
						cursor: pointer;
					}
				}
				
			}
		}
		
	}
	
</style>
