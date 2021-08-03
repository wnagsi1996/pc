<template>
	<div>
		<Header />
			<div class="coninter">
				<el-row :gutter="20">
					<el-col :span="6">
						<div class="contact-box">
							<h4>Contact Us</h4>
							<ul>
								<li>
									<span>TEL:</span>
									<span>+86-4000-899-858</span>
								</li>
								<li>
									<span>Email:</span>
									<span>support@isharelike.com</span>
								</li>
								<li>
									<span>ADD:</span>
									<span>H Buliding, Live Show Wonderland, Quanxiu Street, Fengze, Quanzhou city, Fujian, China</span>
								</li>
								<li>
									<span>USA Contact:</span>
									<span>Chen Ming Yan</span>
								</li>
								<li>
									<span>Facebook:</span>
									<span class="linkishare" @click="_handiSHARE">iSHARE<i class="el-icon-right"></i></span>
								</li>
								<li><span>USA office:</span></li>
								<li>
									<el-image :src="addImg"></el-image>
								</li>
							</ul>
						</div>
					</el-col>
					<el-col :span="18">
						<div class="about">
							<h4>About Us</h4>
							<div class="content">
								<p>iSHARE is a cross - border social distribution platform for global college students that dedicated to selling high-quality Chinese products to the global campus market. Different with the traditional Amazon and eBay these traditional e-commerce platforms, our consumers can buy products with good quality and low price.</p>
								<el-image v-for="(item,index) in showimg" :key="index" :src="item" />
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
		<Footer />
	</div>
</template>

<script>
	export default({
		name:'AboutUs',
		data(){
			return{
				addImg:require('@/assets/image/google-address.jpg'),
				showimg:[
					require('@/assets/image/about00.jpg'),
					require('@/assets/image/about01.jpg'),
					require('@/assets/image/about02.jpg')
				]
			}
		},
		methods:{
			_handiSHARE(){
				window.open('https://www.facebook.com/noritaka.tamamura')
			}
		}
	})
</script>

<style lang="scss" scoped>
	.contact-box{
		padding:20px;
		background-color: #fff;
		&>h4{
			font-size:$text-size-md;
		}
		ul{
			margin-top: 10px;
			li{
				padding:5px 0;
				span{
					line-height: 24px;
				}
				span:first-child{
					font-weight: bold;
					padding-right: 6px;
				}
				.linkishare{
					cursor: pointer;
				}
			}
		}
	}
	.about{
		padding:20px;
		background-color: #fff;
		&>h4{
			text-align: center;
			font-size:$text-size-md;
		}
		.content{
			margin-top: 10px;
			p{
				line-height: 24px;
			}
		}
	}
</style>
