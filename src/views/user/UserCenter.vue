<template>
	<div>
		<Header />
			<div class="coninter">
				<userMenu class="usermenu" />
				<div class="user-box">
					<div class="user-info-box">
						<div class="info-item">
							<div class="user-node">
								<div class="img">
									<img :src="userCenterInfo.headimg" alt="">
								</div>
								<div class="name">
									<div class="username">{{userCenterInfo.ncname}}</div>
									<div class="loginname">{{userCenterInfo.loginname}}</div>
								</div>
							</div>
						</div>
						<div class="info-item">
							<div class="income-node">
								<div class="item">
									<p>Income</p>
									<p>${{userCenterInfo.sr}}</p>
								</div>
								<div class="item">
									<p>Members</p>
									<p>{{userCenterInfo.hy1}}</p>
								</div>
							</div>
						</div>
						<div class="info-item">
							<div class="income-node mess-node">
								<div class="item">
									<p>Coupon</p>
									<p>0</p>
								</div>
								<div class="item">
									<p>Message</p>
									<p>{{userCenterInfo.NotReadNoticeNum}}</p>
								</div>
							</div>
						</div>
					</div>
					<div class="free-box" v-if="freeList.length>0">
						<div class="free-title">
							<div class="name">My Gifts</div>
							<div class="more">More</div>
						</div>
						<div class="list">
							<ShareItem v-for="item in freeList" :key="item.rid" :itemData="item" />
						</div>
					</div>
				</div>
			</div>
		<Footer />
	</div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex'
	export default({
		name:'UserCenter',
		components:{
			userMenu:()=>import('@/components/userMenu'),
			ShareItem:()=>import('@/components/ShareItem')
		},
		computed:{
			...mapGetters([
				'userCenterInfo'
			])
		},
		data(){
			return{
				freeList:[]
			}
		},
		async created() {
			if(Object.keys(this.userCenterInfo).length==0){
				await this.getUserInfo();
			}
			this.getUserPDProductList();
		},
		methods:{
			//获取免费礼品订单列表
			async getUserPDProductList(){
				this.$loading.load();
				const res=await this.$api.user.getUserPDProductList({pdtype:-1,pageindex:0});
				if(res.rows.length>0){
					this.freeList=res.rows;
				}
				this.$loading.unLoad()
			},
			...mapActions({
				getUserInfo:'userInfo/getUserCenterInfo'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		margin:30px auto;
		display: flex;
		.usermenu{
			width: 270px;
		}
		.user-box{
			flex: 1;
			margin-left: 50px;
			.user-info-box{
				display: flex;
				justify-content: space-between;
				.info-item{
					width: 300px;
					padding:20px;
					border-radius: $border-radius-sm;
					box-shadow: $box-shadow-deep;
					.user-node{
						display: flex;
						.img{
							width: 80px;
							height: 80px;
							overflow: hidden;
							border-radius: 50%;
							img{
								width: 100%;
								height: 100%;
							}
						}
						.name{
							flex: 1;
							margin-left: 10px;
							.loginname{
								color:$text-color-three;
								margin-top: 8px;
								font-size:$text-size-xs
							}
						}
					}
					.income-node{
						.item{
							display: flex;
							justify-content: space-between;
							padding-bottom: 20px;
							p:last-child{
								color:$text-color-brand;
							}
						}
					}
				}
			}
			.free-box{
				margin-top: 50px;
				.free-title{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.name{
						font-size: $text-size-md;
					}
					.more{
						color: $text-color-two;
						cursor: pointer;
					}
				}
				.list{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					margin-top: 10px;
				}
			}
		}
	}
</style>
