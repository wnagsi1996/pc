<template>
	<div class="group-buy">
		<div class="title">Latest Group Shopping:</div>
		<div class="item">
			<div class="img-box">
				<span>
					<img :src="infoData.userheadimg" alt="">
				</span>
				<span></span>
			</div>
			<div class="node">
				<div class="name">Needs <em>1</em> more user</div>
				<div class="time">
					<span>Deal ends in</span>
					<CountDown :time="infoData.djsms" @finish="setFinish"></CountDown>
				</div>
			</div>
			<div class="btn">
				<el-button size="mini" type="primary" @click="_handJoin">Join Now</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {countdown} from '../../utlis/utlis.js'
	import CountDown from '@/components/CountDown'
	export default({
		name:'GroupShoppingNode',
		components:{
			CountDown
		},
		props:{
			infoData:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				
			}
		},
		created() {
		},
		methods:{
			_handJoin(){
				this.$emit('jonNow');
			},
			setFinish(){
				//传值倒计时结束
				this.$emit('finish',0)
			}
		}
	})
</script>

<style lang="scss" scoped>
	.group-buy{
		background-color: #fff;
		box-shadow: 0 0 3px #ccc;
		border-radius:8px;
		padding: 10px;
		.item{
			display: flex;
			margin:10px 0;
			padding:10px 0;
			.img-box{
				width: 60px;
				span{
					width: 35px;
					height: 35px;
					border-radius: 20px;
					background: #ccc url('../../assets/image/user_add.png') no-repeat center center/20px;
					display: inline-block;
					border: 2px solid #fff;
					box-sizing: border-box;
					vertical-align: middle;
					img{
						width: 100%;
					}
					&:last-child{
						margin-left: -10px;
					}
				}
			}
			.node{
				flex: 1;
				padding:0 5px 0 10px;
				.time{
					display: flex;
					align-items: center;
					span,.count{
						padding: 0 4px 0 0;
					}
				}
				.name{
					em{
						font-style: normal;
						color: #e41c1d;
					}
				} 
			}
			.btn{
				text-align: center;
				width: 80px;
			}
		}
	}
	
</style>
