<template>
	<div>
		<div class="coupon-node">
			<div class="coupon-node-money">
				<p>{{couponData.vprice}}</p>
				<p>USD</p>
			</div>
			<div class="coupon-node-info">
				<h3>{{couponData.vtitle}}</h3>
				<p>Above ${{couponData.vminmoney}} is available</p>
				<p>Valid until：{{couponData.vyxq}}</p>
				<p class="remark">{{couponData.vremark}}</p>
				<div class="coupon-status"></div>
				<div class="coupon-status-text">{{couponData.vstate | status}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	const vstate=[
		{
			text:'Unuser',
			val:'0'
		},
		{
			text:'Used',
			val:'1'
		},
		{
			text:'Expired',
			val:'2'
		}
	]
	export default({
		name:'CouponItem',
		props:{
			couponData:{
				type:Object,
				default:new Object()
			}
		},
		filters:{
			status(val){
				return vstate.find(n=>n.val==val).text
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coupon-node{
		display: flex;
		margin:10px auto;
		align-items: center;
		overflow: hidden;
		position: relative;
		border-radius: $border-radius-md;
		height: 120px;
		cursor: pointer;
		.coupon-node-money{
			width:25%;
			height:120px;
			border-radius:10px;
			color: #e41c1d;
			text-align: center;
			padding:0 10px;
			background-color: #f7f7f7;
			border-right: 2px dashed #ffff;
			box-sizing: border-box;
			p{
				font-size:24px;
				&:first-child{
					margin-top:30px
				}
			}
		}
		.coupon-node-info{
			width:75%;
			height:120px;
			background-color: #f7f7f7;
			border-radius:10px;
			h3{
				padding:10px 0 8px 10px;
			}
			p{
				padding: 2px 10px 0 10px;
				color:#666;font-size: 12px;
			}
			.remark{
				@include heightHidden;
			}
			.coupon-status{
				width:80px;
				height:80px;
				position: absolute;
				top: -40px;
				right: -40px;
				background-color: red;
				transform:rotate(45deg);
				color: #fff;
			}
			.coupon-status-text{
				position: absolute;
				top: 12px;
				right: 0;
				transform:rotate(45deg);
				color: #fff;
				z-index: 2;
				font-size:12px
			}
		}
	}
</style>
