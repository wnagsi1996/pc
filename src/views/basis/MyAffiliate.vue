<template>
	<div>
		<Header />
		<div class="affiliate-box">
			<div class="title">What is iSHARE Associate?</div>
			<div class="description">iSHARE Associate calculates commissions on a per-order basis. As long as someone buys products via your link, iSHARE will provide commission. For any product, you will get 5% commission from total amount per order.</div>
			<div class="item-node">
				<div class="item">
					<div class="name">1.How to registration?</div>
					<div class="desc">Click https://www.isharelike.net,and login by facebook or e-mail.</div>
					<el-image class="img" :src="img1"></el-image>
				</div>
				<div class="item">
					<div class="name">2.How to get your URL?</div>
					<div class="desc">After registration, according to the arrow icon, there will automatically copy the share link and then you can share it to your fans/friends.</div>
					<el-image class="img" :src="img2"></el-image>
				</div>
				<div class="item">
					<div class="name">3.Commission ratio</div>
					<div class="desc">5% commission to level1 after level 2 bought the product by your link;</div>
					<div class="desc">5% commission to level2 after level 3 bought the product;</div>
					<div class="desc">Nothing from other level members.</div>
					<div class="desc">In other others, if your fans/friends purchases by your link, you can get extra 5% commission. In addition, 1% for you to the guidance.</div>
					<el-image class="img" :src="img3"></el-image>
				</div>
				<div class="item">
					<div class="name">4.Commission withdrawn.</div>
					<div class="desc">You can check commission on your account ,it can be withdrawn.</div>
					<el-image class="img" :src="img4"></el-image>
				</div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	export default({
		name:'MyAffiliate',
		data(){
			return{
				img1:require('../../assets/image/Distribution1.jpg'),
				img2:require('../../assets/image/Distribution2.jpg'),
				img3:require('../../assets/image/Distribution4.jpg'),
				img4:require('../../assets/image/Distribution3.jpg')
			}
		}
	})
</script>

<style lang="scss" scoped>
	.affiliate-box{
		width: 100%;
		max-width: 1000px;
		margin: 20px auto;
		.title{
			font-size: $text-size-lg;
			text-align: center;
		}
		.description{
			margin-top: 15px;
		}
		.item-node{
			margin-top: 40px;
			.item{
				margin-top: 80px;
				.name{
					font-size: $text-size-md;
					padding-bottom: 8px;
				}
				.img{
					width: 600px;
					margin-top: 15px;
				}
				.desc{
					color:$text-color-one;
				}
			}
		}
	}
</style>
