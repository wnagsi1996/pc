<template>
	<div class="list-box">
		<div class="content-top">
			<div class="content-node">
				<div class="img-box">
					<el-image class="img" fit="scale-down" :src="item.img" />
				</div>
				<div class="node">
					<div class="centent-box">
						<div class="item one">
							<span v-html="item.platformname"></span>
							<span>{{item | dateFilter('0')}}</span>
						</div>
						<div class="item two" v-html="item.title"></div>
						<div class="item three">
							<p>{{item.zkj}}</p>
							<span>{{item | wlFilter}}</span>
						</div>
						<div class="item four">
							<p v-html="item.pdesc"></p>
						</div>
					</div>
					<div class="tip" v-if="item.tips!=''">
						<div class="name">Tips</div>
						<ul>
							<li v-for="(item,index) in tipsAttr" :key="index">{{item}}</li>
						</ul>
					</div>
					<div class="tip" v-if="item.features!=''">
						<div class="name">Features</div>
						<ul>
							<li v-for="(item,index) in featuresAttr" :key="index">{{item}}</li>
						</ul>
					</div>
					<div class="less" v-if="!isDetail" @click="_handHideDetail(item.rid)">
						<i class="el-icon-top"></i>
						<span>less</span>
					</div>
				</div>
			</div>
			<div class="content-btn">
				<div class="copy-box" v-if="item.code!=''" v-copy="item.code">
					<div class="copy" @click="_handShowCode">
						<i class="el-icon-scissors"></i>
						<p>COPY CODE</p>
					</div>
					<div class="code" :class="{showCode:item.showCode}" >
						{{item.code}}
					</div>
				</div>
				<a :href="item.url" target="_blank">
					<el-button type="primary">{{item.dtype=='0'?'BUY NOW':'SHOP NOW'}}</el-button>
				</a>
			</div>
		</div>
		<div class="content-bottom">
			<div class="title">
				<h4>DETAILS</h4>
			</div>
			<div class="node">
				<div class="node-left">
					<div class="date">
						<div class="icon">
							<i class="el-icon-time"></i>
						</div>
						<ul>
							<li>{{item | dateFilter('1')}}</li>
							<li>{{item | fversj}}</li>
						</ul>
					</div>
					<div class="date">
						<div class="icon">
							<i class="el-icon-orange"></i>
						</div>
						<div>
							<ul>
								<li>Popularity:{{item.popul}}/5</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="node-right">
					<div class="name">
						<h4>Related Offers</h4>
					</div>
					<div>
						<ul>
							<li v-for="node in item.list" :key="node.rid">
								<router-link to="/">
									<div class="item-node">
										<div class="top">
											<el-image class="img" lazy fit="scale-down" :src="node.img"></el-image>
										</div>
										<div class="bottom">
											<p>{{node.platformname}} {{node | dateFilter('0')}}</p>
											<h5>{{node.title}}</h5>
											<div class="price">
												<span class="one">{{node.zkj}}</span>
												<span class="two" v-if="node.oriprice!=0.00">{{node.oriprice}}</span>
											</div>
										</div>
									</div>
								</router-link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	let timer=null
	export default({
		name:'simple',
		props:{
			item:Object,
			isDetail:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			tipsAttr(){
				const {tips}=this.item;
				const tipattr=tips.split("^")
				return tipattr;
			},
			featuresAttr(){
				const {features}=this.item;
				const featuresAttr=features.split("^");
				return featuresAttr
			}
		},
		methods:{
			//显示折扣吗
			_handShowCode(rid){
				this.item.showCode=true
				//判断是否已经点击过，有就取消隐藏，从新计算
				if(timer){
					clearTimeout(timer)
				}
				timer=setTimeout(()=>{
					this.item.showCode=false
				},3000)
			},
			_handHideDetail(rid){
				this.$emit('hideDetail',rid)
			}
		},
		filters:{
			//物流
			wlFilter(item){
				var wlprice = Number(item.wlprice);
				if (wlprice == 0)
					wlprice = "";
				let logistics=''
				switch (item.wltype) {
					case "0":
						if (item.wljsfs == "0") {
							if (wlprice == "")
								logistics = "+free shipping";
							else
								logistics = "+$"+wlprice + " shipping";
						}
						else if (item.wljsfs == "1")
							logistics = "+free shipping w/ $" + wlprice;
						else if (item.wljsfs == "2")
							logistics = "+free shipping w/ Prime";
						else
							logistics = "+free shipping";
						break;
					case "1":
						logistics = "+pickup at " + item.platformname;
						break;
					case "2":
						logistics = "";
						break;
					case "3":
						logistics = "+digital download";
						break;
				}
				return logistics;
			},
			//时间
			dateFilter(item,num){
				var total = item.fcjsj_span;
				var minute = parseInt(total / 60); //计算整数分钟数
				var jsday = parseInt(total / (24 * 60 * 60)); //计算整数天数
				var jsafterDay = total - jsday * 24 * 60 * 60; //取得算出天数后剩余的秒数
				var jshour = parseInt(total / (60 * 60)); //计算整数小时数
				var week = parseInt(jsday / 7); 
				var month = parseInt(jsday / 30);
				var year = parseInt(jsday / 365);
				var showdate = "", showdate1 = "";
				if (minute == 0) {
					showdate = "just recently";
					showdate1 = "Published " + showdate;
				} else if (minute > 0 && jshour == 0) {
					showdate=minute==1?`${minute} minute ago`:`${minute}minutes ago`
					 showdate1 = "Published " + showdate;
				} else if (jshour > 0 && jsday == 0) {
					showdate=jshour == 1?`${jshour} hr ago`:`${jshour} hrs ago`
					showdate1 = "Published " + showdate;
				} else if (jsday > 0 && week == 0) {
					showdate=jsday == 1?`${jsday} day ago`:`${jsday} days ago`
					showdate1 = "Published " + item.fcjsj;
				} else if (0 < week && month == 0) {
					showdate=week == 1?`${week} week ago`:`${week} weeks ago`
					 showdate1 = "Published " + item.fcjsj;
				} else if (0 < month && year == 0) {
					showdate=month==1?`${month} month ago`:`${month} months ago`
					showdate1 = "Published " + item.fcjsj;
				} else if (year > 0) {
					showdate=year==1?`${year} year ago`:`${year} years ago`
					showdate1 = "Published " + item.fcjsj;
				}
				return num=='0'?showdate:showdate1;
			},
			//审核时间
			fversj(item){
				var fversj = item.fversj_span;
				var fverminute = parseInt(fversj / 60); //计算整数分钟数
				var fverhour = parseInt(fversj / (60 * 60)); //计算整数小时数
				var fverdate="";
				if (fverminute == 0) {
					fverdate = "Verified just recently";
				} else if (0 < fverminute && fverhour == 0) {
					fverdate = "Verified " + fverminute + " minutes ago";
				} else if (0 < fverhour && fverhour < 24) {
					fverdate = "Verified " + fverhour + " hrs ago";
				} else {
					fverdate = "Verified " + item.fversj;
				}
				return fverdate;
			}
		}
	})
</script>

<style lang="scss" scoped>
	.list-box{
		margin:20px 0;
		padding:10px;
		border-radius: $border-radius-sm;
		border:1px solid $text-color-four;
		.content-top{
			.content-node{
				display: flex;
				.img-box{
					width: 300px;
					height: 300px;
					.img{
						width: 300px;
						height: 300px;
					}
				}
				.centent-box{
					width: 1000px;
					margin:0 20px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.item{
						margin-bottom: 20px;
					}
					.one{
						color: $text-color-three;
					}
					.two{
						font-size: $text-size-lg;
					}
					.three{
						display: flex;
						align-items: center;
						p{
							color: $text-color-success;
							font-size: $text-size-2x;
						}
						span{
							font-size: $text-size-xs;
							color: $text-color-three;
							font-style: italic;
							padding-left: 10px;
						}
					}
					.four{
						@include flexBetweeCenter;
						color: $text-color-three;
						
						p{
							flex: 1;
							@include heightHidden;
						}
					}
				}
				.tip{
					display: flex;
					margin:10px 20px;
					.name{
						width: 100px;
						font-weight: bold;
					}
					ul{
						li{
							height: 24px;
							list-style: disc;
						}
					}
				}
				.less{
					margin-left: 20px;
					color: $text-color-brand;
					cursor: pointer;
					i{
						font-size: $text-size-md;
					}
				}
			}
			.content-btn{
				display: flex;
				margin-top: 20px;
				justify-content: flex-end;
				align-items: center;
				.copy-box{
					position: relative;
					width: 106px;
					cursor: pointer;
					margin-right: 10px;
					.copy{
						display: flex;
						p{
							margin-left: 8px;
						}
					}
					.code{
						width: 106px;
						padding:5px 0;
						background-color: #e8e8e8;
						display: inline-block;
						position: absolute;
						left: 50%;
						top:35px;
						border:5px;
						text-align: center;
						transform: translateX(-53px);
						border-radius: $border-radius-xs;
						color: $text-color-brand;
						opacity: 0;
						transition: all .5s;
						&::after{
							content: '';
							width: 0;
							height: 0;
							position: absolute;
							left: 50%;
							top:-20px;
							transform: translateX(-10px);
							border-top:10px solid transparent;
							border-right:10px solid transparent;
							border-bottom:10px solid #e8e8e8;
							border-left:10px solid transparent;
						}
					}
					.showCode{
						opacity: 1;
					}
				}
			}
			
		}
		.content-bottom{
			width: 100%;
			margin-top: 30px;
			.title{
				width: 100%;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-bottom: 2px solid $text-color-four;
				h4{
					width: 150px;
					border-bottom: 2px solid $text-color-brand;
					color: $text-color-brand;
				}
			}
			.node{
				display: flex;
				height: 320px;
				.node-left{
					width: 350px;
					margin:10px 0;
					border-right: 1px solid $text-color-four;
					.date{
						margin:20px;
						display: flex;
						align-items: center;
						.icon{
							width: 50px;
							i{
								font-size: $text-size-lg;
								color: $text-color-three;
							}
						}
						ul{
							li{
								height: 20px;
								line-height: 20px;
							}
						}
					}
				}
				.node-right{
					flex: 1;
					padding: 20px;
					.name{
						color:$text-color-three;
						h4{
							font-size: $text-size-md;
							color: $text-color-three;
						}
					}
					ul{
						margin-top: 20px;
						display: flex;
						justify-content: space-between;
						li{
							width: 130px;
							padding:10px;
							box-shadow: $box-shadow-deep;
							border-radius: $border-radius-md;
							.top{
								width: 130px;
								height: 130px;
								.img{
									width: 130px;
									height: 130px;
								}
							}
							p{
								@include heightHidden;
								color: $text-color-three;
							}
							h5{
								margin-top: 8px;
								height: 40px;
								line-height: 20px;
								@include heightHiddens(2)
							}
							.price{
								margin-top: 8px;
								display: flex;
								align-items: flex-end;
								.one{
									font-size:$text-size-lg;
									color:$text-color-brand;
									@include heightHidden;
								}
								.two{
									@include strikethrough;
								}
							}
						}
					}
				}
			}
		}
		
	}
	
</style>
