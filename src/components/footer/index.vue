<template>
	<div class="footer">
		<div class="footer-box">
			<el-row :gutter="20">
				<el-col :span="6">
					<div class="footer-node">
						<div class="name">About iSHARE</div>
						<div class="info">
							<div class="item">
								support@isharelike.com
							</div>
							<div class="item">
								<router-link to="/aboutus">About Us</router-link>
							</div>
							<div class="item">
								<router-link to="/contactus">Contact Us</router-link>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="footer-node">
						<div class="name">Buy</div>
						<div class="info">
							<div class="item">
								<router-link to="/register">Registration</router-link>
							</div>
							<div class="item">
								<router-link to="/login">Login</router-link>
							</div>
							<!-- <div class="item">
								<a href="">Sell</a>
							</div> -->
							<div class="item">
								<router-link to="/productlist">Product</router-link>
							</div>
							<div class="item">
								<router-link to="/freelist">Free Product</router-link>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="footer-node">
						<div class="name">Help</div>
						<div class="info">
							<div class="item">
								<router-link to="/howtogetfreegifts">How To Get Free Gifts</router-link>
							</div>
							<div class="item">
								<router-link to="/returnpolicy">Return Policy</router-link>
							</div>
							<div class="item">
								<router-link to="/faq">FAQ</router-link>
							</div>
							<div class="item">
								<router-link to="/termsofuse">Terms of Use</router-link>
							</div>
							<div class="item">
								<router-link to="/privacysecuritypolicy">Privacy Security Policy</router-link>
							</div>
						</div>
					</div>
				</el-col>
	
				<el-col :span="6">
					<div class="footer-node">
						<div class="name payname">Payment methods:</div>
						<el-image class="img" lazy :src="pay"></el-image>
						<div class="name payname">Buy with confidence:</div>
						<el-image class="img pay1img" lazy :src="pay1"></el-image>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="footer-bottom">© 2021 iSHARE</div>
	</div>
</template>
<script>
	export default({
		data(){
			return{
				pay:require('@/assets/image/pay.png'),
				pay1:require('@/assets/image/pay1.png')
			}
		}
	})
</script>

<style lang="scss" scoped>
	.footer {
		padding: 60px 0 0;
		margin: 80px 0 0;
		border-top: 1px solid $text-color-four;
		background-color: #434343;
		.footer-box{
			max-width: $doc-width;
			width: 100%;
			margin: 0 auto 40px;
			.footer-node {
				.name {
					// font-weight: bold;
					color: #fff;
					font-size: $text-size-md;
				}
				.payname{
					margin-bottom: 10px;
				}
				.img{
					margin-bottom: 30px;
				}
				.pay1img{
					width: 150px;
				}
				.info {
					margin-top: 20px;
					.item {
						padding: 10px 0;
						color: $text-color-four;
						a {
							color: $text-color-four;
						}
					}
				}
			}
		}
		.footer-bottom{
			height: 40px;
			line-height: 40px;
			background-color: #242424;
			text-align: center;
			color: #fff;
		}
	}
</style>
