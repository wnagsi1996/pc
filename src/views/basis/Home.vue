<template>
	<div class="bj">
		<Header />
		<el-carousel height="700px">
			<el-carousel-item v-for="item in banner" :key="item.app">
				<img :src="item.img" alt="" />
			</el-carousel-item>
		</el-carousel>
		<div class="coninter">
			<div class="ad-box">
				<div class="ad-item">
					<a href="">
						<img :src="ad[0].img" alt="">
					</a>
				</div>
				<div class="ad-item">
					<a href="">
						<img :src="ad[1].img" alt="">
					</a>
				</div>
			</div>
			<div class="hot-box">
				<div class="hot-header">
					<div class="title">Deals Product</div>
					<div class="more">
						<router-link to="/dealslist">More Deals</router-link>
					</div>
				</div>
				<div class="hot-node">
					<div class="hot-item" v-for="item in dealsList" :key="item.rid" @click="_handToDeal(item.rid)">
						<div class="img">
							<el-image lazy style="width: 140px; height: 140px" :src="item.img" fit="scale-down">
							</el-image>
						</div>
						<div class="info">
							<div class="title">{{item.platformname}}</div>
							<div class="price">
								<span class="new">{{item.zkj}}</span>
								<span class="old" v-if="item.oriprice!=0.00">${{item.oriprice}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="hot-box">
				<div class="hot-header">
					<div class="title">Share Get</div>
					<div class="more">
						<router-link to="/freelist">More Free Gifts</router-link>
					</div>
				</div>
				<div class="hot-node">
					<div class="hot-item" v-for="item in shareget" :key="item.rid" @click="toUrl(item.url)">
						<div class="img">
							<el-image lazy :src="item.imgsrc" fit="scale-down"></el-image>
						</div>
						<div class="info">
							<div class="share-price">
								<span class="new">Free</span>
								<span class="old">{{item.price}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="categ-box">
				<div class="categ-header">Featured Categories</div>
				<div class="categ-node">
					<div class="categ-item" v-for="item in categories" :key="item.id">
						<div class="name">{{item.name}}</div>
						<div class="info" @click="_handToCate(item.id)">
							<el-image lazy v-for="(n,i) in item.detail" :key="i" :src="n.imgsrc" alt="" />
						</div>
					</div>
				</div>
			</div>
			<div class="media-box">
				<div class="media-header">Internet & Media Celebrities</div>
				<div class="media-node">
					<div class="media-item" v-for="(item,index) in celebrities" :key="index">
						<div class="media-img">
							<el-image lazy :src="item.pohosrc" alt="" />
						</div>
						<div class="media-info">
							<div class="name">{{item.name}}</div>
							<div class="desc">{{item.description}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="love-box">
				<div class="love-header">Love</div>
				<div class="love-node">
					<div class="love-item" v-for="(item,index) in love" :key="index" @click="toUrl(item.url)">
						<div class="love-img">
							<el-image lazy :src="item.imgsrc" alt="" />
						</div>
						<div class="love-price">
							<div class="new">{{item.xprice}}</div>
							<div class="old">{{item.yprice}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import {
		Carousel,
		CarouselItem,
		Image
	} from 'element-ui'
	export default {
		name: 'Home',
		components: {
			[Carousel.name]: Carousel,
			[CarouselItem.name]: CarouselItem,
			[Image.name]: Image,
		},
		data() {
			return {
				searchVal: '',
				banner: Object.freeze([{
						url: '',
						img: require('../../assets/image/relx.jpg'),
						app: 0
					},
					{
						url: '',
						img: require('../../assets/image/xiaomi.jpg'),
						app: 1
					}
				]),
				shareget: Object.freeze([{
					"url": "/product?pid=45741",
					"price": "$49.99",
					"imgsrc": "https://images-na.ssl-images-amazon.com/images/I/81JHJlCqU4L._SL320_.jpg"
				}, {
					"url": "/product?pid=45740",
					"price": "$39.99",
					"imgsrc": "https://images-na.ssl-images-amazon.com/images/I/81k-PgciolL._SL320_.jpg"
				}, {
					"url": "/product?pid=41763",
					"price": "$12.99",
					"imgsrc": "https://images-na.ssl-images-amazon.com/images/I/51%2B8AnqYIGL._SL320_.jpg"
				}, {
					"url": "/product?pid=41727",
					"price": "$59.95",
					"imgsrc": "https://images-na.ssl-images-amazon.com/images/I/61fn5JwZYpL._SL320_.jpg"
				}, {
					"url": "/product?pid=41696",
					"price": "$79.99",
					"imgsrc": "https://images-na.ssl-images-amazon.com/images/I/61l6T-AN41L._SL320_.jpg"
				}, {
					"url": "/product?pid=41772",
					"price": "$46.37",
					"imgsrc": "https://images-na.ssl-images-amazon.com/images/I/81GXs1mC8rL._SL320_.jpg"
				}, {
					"url": "/product?pid=45786",
					"price": "$27.99",
					"imgsrc": "https://images-na.ssl-images-amazon.com/images/I/612SEDIvAHL._SL320_.jpg"
				}, {
					"url": "/product?pid=45792",
					"price": "$23.40",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1SCvdFHSYBuNjSspiq6xNzpXaz/Original-Justfog-C601-pod-3pcs-per-pack-for-justfog-C601-starter-kit-1-7ml-capacity-top.jpg_220x220.jpg"
				}]),
				categories: Object.freeze([{
					"name": "Mother & Kids",
					"id": 1217,
					"detail": [{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1ROnAbovrK1RjSszfq6xJNVXa5/Genuine-Leather-Ballet-Slippers-Girls-Soft-Sheepskin-Ballet-Shoes-Lace-Up-Gymnastics-Dance-Shoes.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1zeEzOVXXXXahaVXXq6xXFXXXt/Hangerlink-Beige-Kids-Standard-Flocked-Velvet-Dress-Hanging-Orginazer-Hanger-No-Slip-Ultra-Slim-with-U.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1DWVcaUzrK1RjSspmq6AOdFXaT/Flappy-Elephant-Baby-elefante-plush-Peek-A-Boo-elephant-Animals-Electric-Stuffed-Plush-Toy-Play-Music.jpg_220x220.jpg"
						}
					]
				}, {
					"name": "Women's Clothing",
					"id": 1212,
					"detail": [{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1sNvwB79WBuNjSspeq6yz5VXaY/2018-Fashion-Boho-Beach-Long-Dress-Casual-V-Neck-Short-Sleeve-Irregular-Women-Dress-Pocket-Slit.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1walZKuySBuNjy1zdq6xPxFXaA/GOSOUER-Women-Two-Piece-Off-Shoulder-Swimswear-Bikini-Set-Ruffled-Flounce-Crop-Bikini-Top-with-Print.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1pPTsweGSBuNjSspbq6AiipXaT/snowshine3-YLW-Women-One-Piece-High-Neck-V-Neckline-Mesh-Ruched-Monokini-Swimwear.jpg_220x220.jpg"
						}
					]
				}, {
					"name": "Consumer Electronics",
					"id": 1213,
					"detail": [{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1e8RCXfvsK1RjSspdq6AZepXaH/GGMM-D6-Portable-Speaker-for-Amazon-Echo-Dot-2nd-Generation-20W-Powerful-for-Alexa-Speaker-5200mAh.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1ZebVXH1YBuNjSszhq6AUsFXaP/Logitech-Wireless-Combo-MK270-with-Keyboard-and-Mouse.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1LWDdyyCYBuNkHFCcq6AHtVXa4/Outlet-Wall-Mount-Hanger-Stand-Amazon-Echo-Dot-2-Generation-Other-Round-Voice-Assistants-A-Solution.jpg_220x220.jpg"
						}
					]
				}, {
					"name": "Beauty & Health",
					"id": 1436,
					"detail": [{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1kNdgau6sK1RjSsrbq6xbDXXa3/Brand-New-Buttercup-Setting-Powder-Face-Baking-Powders-Makeup-Highlighter-Blending-in-Box-Full-Size-28g.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1PeQIbizxK1RjSspjq6AS.pXag/Korea-Cosmetics-Rice-Water-Bright-Cleansing-Foam-Facial-Cleanser-Moisturizing-Oil-Control-Remove-Blackhead-Face-Cleanser.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1rjM3dpuWBuNjSspnq6x1NVXab/Beauty-Glazed-Glitter-Injections-Pressed-Glitters-Eyeshadow-Diamond-Rainbow-Makeup-Cosmetic-15-Colors-Eye-Shadow-Magnet.jpg_220x220.jpg"
						}
					]
				}, {
					"name": "Home & Garden",
					"id": 1216,
					"detail": [{
							"imgsrc": "https://ae01.alicdn.com/kf/HLB1PZA2acfrK1Rjy1Xdxh5emFXaG/Flash-Furniture-21-875-W-x-26-625-L-Adjustable-Rectangular-Blue-Plastic-Activity-Table-Set.jpeg_220x220.jpeg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1LiBGvtknBKNjSZKPq6x6OFXa5/Foldable-Table-with-Cup-Holder-TV-Tray-Portable-Folding-Snack-Table-Adjustable-Sofa-Side-Table-for.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1Y5DXa0fvK1RjSspoq6zfNpXaF/Detangling-Brush-Glide-Thru-Detangler-Hair-Comb-Or-Brush-No-More-Tangle-For-Adults-Kids-Pink.jpg_220x220.jpg"
						}
					]
				}, {
					"name": "Swimming",
					"id": 1218,
					"detail": [{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB1BDmdrh9YBuNjy0Ffq6xIsVXaE/Durable-No-skid-Soft-Silicone-Steel-Wire-Nose-Clip-for-Swimming-Diving-Water-Sports-Swimming-Nose.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB13c20OFXXXXX0aFXXq6xXFXXXy/Soft-Silicone-Swimming-Nose-Clips-2-Ear-Plugs-Earplugs-Gear-with-a-case-box-Set-Pool.jpg_220x220.jpg"
						},
						{
							"imgsrc": "https://ae01.alicdn.com/kf/HTB12xh1c3KTBuNkSne1q6yJoXXaP/FENICAL-28x83cm-Microfiber-Chilly-Towel-Ice-Scarf-Neck-Cooler-Swimming-Towels-for-Sports-Yoga-Gym-Fitness.jpg_220x220.jpg"
						}
					]
				}]),
				celebrities: [{
					"url": "https://www.youtube.com/watch?v=wrJixSI05fo",
					"pohosrc": require('../../assets/image/media01.jpg'),
					"name": "ForeiignBoii",
					"description": "On my channel, there are going to be a variety of videos. Including vlogging, basketball videos, sneaker vlogs, sneaker pickups and more!!! Be sure to stay tuned. You won't want to miss it."
				}, {
					"url": "https://www.youtube.com/watch?v=JImiTrxrPR8",
					"pohosrc": require('../../assets/image/media02.jpg'),
					"name": "ConnorTV",
					"description": "Hey it's Connor and I like making videos. I like sneakers. I like streetwear fashion. I like Supreme, Bape, Nike, Air Jordan, Adidas and Yeezys. I like doing pranks. I like entertaining and making people laugh. Like it or not I'm here to leave my mark on YouTube."
				}, {
					"url": "https://www.youtube.com/watch?v=DmQOUprEBb0",
					"pohosrc": require('../../assets/image/media03.jpg'),
					"name": "WearTesters",
					"description": "WearTesters has been bringing you the best and most accurate in-depth performance reviews & product reviews on some of the latest basketball shoes since '09."
				}, {
					"url": "https://www.youtube.com/watch?v=sUyw6Xo91jk",
					"pohosrc": require('../../assets/image/media04.jpg'),
					"name": "HEAT Ledger",
					"description": "Sneakerhead from Toronto, Canada. I do videos on Sneakers, basketball, streetwear, and vlogs. Hit that subscribe button, thank you!"
				}],
				love: [{
					"url": "/product?pid=37942",
					"yprice": "$14.91",
					"xprice": "8.05",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1gtvWdh1YBuNjy1zcq6zNcXXaK/TR90-Soft-Flexible-Polarized-Silicone-Kids-Sunglasses-Children-Safety-Coating-Rubber-Sun-Glasses.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=41364",
					"yprice": "$56.94",
					"xprice": "$28.47",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1jNgFXZfrK1RkSnb4q6xHRFXaf/Baby-Tooth-Box-Milk-Teeth-Wood-Storage-Collection-For-Baby-Spanish-Kids-Teeth-Box-Creative-Children.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=41210",
					"yprice": "$41.13",
					"xprice": "$21.39",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1Q6OfX6zuK1RjSsppq6xz0XXaE/Baby-Care-Air-Drying-Soft-Clay-Baby-Handprint-Footprint-Imprint-Kit-Casting-Baby-Hand-Inkpad-Fingerprint.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=21775",
					"yprice": "$7.50",
					"xprice": "$3.83",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1f0mGIeSSBuNjy0Flq6zBpVXax/New-Beach-Swimming-Water-Sport-Socks-Anti-Slip-Shoes-Yoga-Fitness-Dance-Swim-Surfing-Diving-Underwater.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=52373",
					"yprice": "$23.58",
					"xprice": "$12.97",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1ng1aavvsK1Rjy0Fiq6zwtXXaV/Demon-killer-Replacement-Resin-Tube-and-Drip-Tip-Mouthpiece-for-TFV8-Baby-atomizer-cleito-tank-3.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=21191",
					"yprice": "$20.61",
					"xprice": "$11.34",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1ipctdsuYBuNkSmRyq6AA3pXaW/Swimming-goggles-HD-Anti-Fog-100-UV-adult-swim-goggles-with-Earplugs-Nose-clips-Case-for.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=41194",
					"yprice": "$9.84",
					"xprice": "$5.31",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1krouKXOWBuNjy0Fiq6xFxVXac/2019-New-Manual-Electric-Breast-Pump-Partner-Breast-Feeding-Collector-Automatic-Correction-Breast-Milk-Silicone-Breast.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=40787",
					"yprice": "$69.39",
					"xprice": "$38.16",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1L4ZvXN_rK1RkHFqDq6yJAFXaR/Clocolor-Sheath-Dress-Elegant-Women-Off-Sholuder-Long-Sleeve-Stripes-Color-Block-White-Black-Bodycon-Maxi.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=52752",
					"yprice": "$9.63",
					"xprice": "$4.82",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1kPt2deuSBuNjSsplq6ze8pXa4/MOOL-12V-Security-Alarm-Strobe-Signal-Safety-Warning-Blue-Red-Flashing-LED-Light-Orange.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=52684",
					"yprice": "$96.42",
					"xprice": "$52.07",
					"imgsrc": "https://ae01.alicdn.com/kf/H21638719bfb94a7ca947cc13affe0361h/Dual-Screen-4K-1080P-Sports-Waterproof-Camera-Sports-DV-2-4G-Remote-Control-Sports-Camera.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=41519",
					"yprice": "$10.56",
					"xprice": "$5.81",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1oS7PCL5TBuNjSspcq6znGFXaI/Z10-Light-Sensor-Control-Night-Light-Mini-EU-US-Plug-Novelty-Square-Bedroom-lamp-For-Baby.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=41371",
					"yprice": "$28.77",
					"xprice": "$14.67",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1d62zKpXXXXcnXFXXq6xXFXXX9/3-Level-Dimmable-Clover-LED-Sensor-Desk-Light-Eye-Protection-Lamp-Flexible-Night-Lighting-Table-Lamp.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=41056",
					"yprice": "$47.46",
					"xprice": "$25.63",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1oziOajDuK1Rjy1zjq6zraFXaZ/2019-Dropship-New-Arrival-3D-Print-Galaxy-Moon-Lamp-Colorful-Change-Touch-Led-Night-Light-Home.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=52357",
					"yprice": "$9.54",
					"xprice": "$4.87",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1_OswXOHrK1Rjy0Flq6AsaFXau/Useful-1PC-Portable-Toothbrush-Holder-Bathroom-Accessories-Electric-Toothbrush-Case-Holder-Travel-Storage-Box.jpg_220x220.jpg"
				}, {
					"url": "/product?pid=52446",
					"yprice": "$6.78",
					"xprice": "$3.39",
					"imgsrc": "https://ae01.alicdn.com/kf/HTB1ScHYbwFY.1VjSZFqq6ydbXXaw/1Pcs-Simple-Elegant-Design-Western-Stirrup-Keychain-Key-Ring-Hanger-Tool-For-Men-Women-Bag-Decoration.jpg_220x220.jpg"
				}],
				ad: [{
						url: '',
						img: require('../../assets/image/home-free.jpg'),
					},
					{
						url: '',
						img: require('../../assets/image/home-voucher.jpg'),
					}
				],
				dealsList: []
			}
		},
		created() {
			this.getDealProduct()
		},
		methods: {
			//获取八个折扣产品
			async getDealProduct() {
				this.$loading.load()
				const res = await this.$api.product.getTop8DealsList()
				if (res.rows) {
					this.dealsList = Object.freeze(res.rows)
				}
				this.$loading.unLoad()
			},
			toUrl(url) {
				window.open(url, '_blank');
			},
			_handToDeal(rid) {
				this.$router.push('/deals?rid=' + rid)
			},
			_handToCate(id) {
				this.$router.push('productlist?pid=' + id)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.bj {
		background-color: #f7f7f7;
	}

	.coninter {
		width: 100%;
		max-width: $doc-width;

		.ad-box {
			margin: 50px auto;
			display: flex;
			justify-content: space-between;

			.ad-item {
				width: 650px;

				a {
					img {
						width: 100%;
						border-radius: 10px;
					}
				}
			}
		}

		.hot-box {
			margin: 50px auto;

			.hot-header {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;

				.title {
					font-size: $text-size-lg;
				}

				.more {
					color: $text-color-three;
				}
			}

			.hot-node {
				margin-top: 20px;
				padding: 20px 10px 10px;
				border-radius: $border-radius-md;
				background-color: #fff;
				display: flex;
				justify-content: space-between;

				.hot-item {
					width: 160px;
					cursor: pointer;

					.img {
						width: 140px;
						height: 140px;
						margin: 0 auto;

						img {
							width: 100%;
							margin: 0 auto;
						}
					}

					.info {
						.title {
							width: 100%;
							height: 25px;
							line-height: 25px;
							@include heightHidden;
						}

						.price {
							display: flex;
							align-items: center;
							margin-top: 8px;

							.new {
								flex: 1;
								font-size: $text-size-md;
								color: $text-color-brand;
								@include heightHidden;
							}

							.old {
								flex: 1;
								@include strikethrough;
							}
						}

						.share-price {
							display: flex;
							flex-direction: column;
							align-items: center;
							margin-top: 10px;

							.new {
								color: $text-color-brand;
								font-size: $text-size-md;
								padding-bottom: 10px;
								font-size: $text-size-sm;
							}

							.old {
								@include strikethrough;
							}
						}
					}
				}
			}
		}

		.categ-box {
			margin: 50px auto;

			.categ-header {
				font-size: $text-size-lg;
			}

			.categ-node {
				margin-top: 20px;
				@include flexBetweeCenter;
				flex-wrap: wrap;

				.categ-item {
					width: 420px;
					padding: 10px;
					margin-bottom: 30px;
					border-radius: $border-radius-md;
					background-color: #fff;
					cursor: pointer;

					.name {
						font-size: $text-size-md;
					}

					.info {
						margin-top: 10px;
						@include flexBetweeCenter;

						img {
							width: 100px;
							height: 100px;
						}
					}
				}
			}
		}

		.media-box {
			margin: 50px auto;

			.media-header {
				font-size: $text-size-lg;
			}

			.media-node {
				margin-top: 20px;
				@include flexBetweeCenter;

				.media-item {
					width: 300px;
					padding: 10px;
					border-radius: $border-radius-md;
					background-color: #fff;
					@include flexBetweeCenter;

					.media-img {
						width: 80px;
						height: 80px;

						img {
							width: 100%;
							height: 100%;
							border-radius: 50px;
						}
					}

					.media-info {
						flex: 1;
						padding-left: 10px;

						.name {
							font-weight: bold;
							font-size: $text-size-md;
						}

						.desc {
							margin-top: 8px;
							color: $text-color-one;
							line-height: 20px;
							@include heightHiddens(4);
						}
					}
				}
			}
		}

		.love-box {
			margin: 50px auto;

			.love-header {
				font-size: $text-size-lg;
			}

			.love-node {
				margin-top: 20px;
				@include flexBetweeCenter;
				flex-wrap: wrap;

				.love-item {
					width: 250px;
					margin: 20px 0;

					.love-img {
						cursor: pointer;

						img {
							width: 250px;
							height: 250px;
							border-radius: $border-radius-sm;
						}
					}

					.love-price {
						display: flex;
						align-items: flex-end;
						margin-top: 5px;

						.new {
							font-weight: bold;
							padding-right: 5px;
							font-size: $text-size-md;
						}

						.old {
							@include strikethrough;
						}
					}
				}
			}
		}
	}
</style>
