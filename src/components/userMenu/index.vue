<template>
	<div class="menu-box">
		<router-link v-for="(item,index) in list" :key="index" :to="item.url" :class="{active:item.isCheck}">{{item.name}}</router-link>
	</div>
</template>

<script>
	export default({
		name:'userMent',
		data(){
			return{
				list:[
					{
						name:'My iSHARE Account',
						url:'/usercenter',
						isCheck:true
					},
					{
						name:'My Income',
						url:'/myincome',
						isCheck:false
					},
					{
						name:'My Gifts',
						url:'/mygifts',
						isCheck:false
					},
					{
						name:'My Order',
						url:'/myorder',
						isCheck:false
					},
					{
						name:'My Like',
						url:'/mylike',
						isCheck:false
					},
					{
						name:'My Members',
						url:'/mymembers',
						isCheck:false
					},
					{
						name:'My Coupon',
						url:'/mycoupon',
						isCheck:false
					},
					{
						name:'My Profile',
						url:'/myprofile',
						isCheck:false
					},
					{
						name:'My Address',
						url:'/myaddress',
						isCheck:false
					},
					{
						name:'My Notices',
						url:'/mynotices',
						isCheck:false
					},
					{
						name:'Settings',
						url:'/setting',
						isCheck:false
					},
					// {
					// 	name:'iSHARE Associate',
					// 	url:'',
					// 	isCheck:false
					// }
				]
			}
		},
		created() {
			const path=this.$route.path;
			this.list.forEach(n=>{
				if(path==n.url){
					n.isCheck=true
				}else{
					n.isCheck=false
				}
			})
		},
	})
</script>

<style lang="scss" scoped>
	.menu-box{
		width: 300px;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		box-shadow: $box-shadow-deep;
		border-radius: $border-radius-sm;
		height:550px;
		a{
			height: 50px;
			line-height: 50px;
			display: block;
			padding-left: 20px;
			border-left:5px solid #fff;
			&:hover{
				color:$text-color-brand;
			}
		}
		.active{
			border-left:5px solid $text-color-brand;
			background-color: $bj-color-gray;
			color: $text-color-brand;
		}
	}
</style>
