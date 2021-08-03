<template>
	<div class="list-box">
			<div class="img-box">
				<router-link :to="'/deals?rid='+item.rid">
					<el-image class="img" fit="scale-down" :src="item.img" />
				</router-link>
				
			</div>
			<div class="centent-box">
				<div class="one">
					<span v-html="item.platformname"></span>
					<span>{{item | dateFilter}}</span>
				</div>
				<div class="two" v-html="item.title"></div>
				<div class="three">
					<p>{{item.zkj}}</p>
					<span>{{item | wlFilter}}</span>
				</div>
				<div class="four">
					<p v-html="item.pdesc"></p>
					<p @click="_handShowDetail(item.rid,item.typeid)">more</p>
				</div>
			</div>
			<div class="right-box">
				<a :href="item.url" target="_blank">
					<el-button type="primary">{{item.dtype=='0'?'BUY NOW':'SHOP NOW'}}</el-button>
				</a>
				
				<div class="copy-box" v-if="item.code!=''" v-copy="item.code">
					<div class="copy" @click="_handShowCode">
						<i class="el-icon-scissors"></i>
						<p>COPY CODE</p>
					</div>
					<div class="code" :class="{showCode:item.showCode}" >
						{{item.code}}
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
			item:Object
		},
		methods:{
			//显示折扣吗
			_handShowCode(){
				this.item.showCode=true
				//判断是否已经点击过，有就取消隐藏，从新计算
				if(timer){
					clearTimeout(timer)
				}
				timer=setTimeout(()=>{
					this.item.showCode=false
				},3000)
			},
			_handShowDetail(rid,typeid){
				this.$emit('_handShowDetail',{sptype:typeid,did:rid})
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
			dateFilter(item){
				var total = item.fcjsj_span;
				var minute = parseInt(total / 60); //计算整数分钟数
				var jsday = parseInt(total / (24 * 60 * 60)); //计算整数天数
				var jsafterDay = total - jsday * 24 * 60 * 60; //取得算出天数后剩余的秒数
				var jshour = parseInt(total / (60 * 60)); //计算整数小时数
				var week = parseInt(jsday / 7); 
				var month = parseInt(jsday / 30);
				var year = parseInt(jsday / 365);
				var showdate = "";
				if (minute == 0) {
					showdate = "just recently";
				} else if (minute > 0 && jshour == 0) {
					showdate=minute==1?`${minute} minute ago`:`${minute}minutes ago`
				} else if (jshour > 0 && jsday == 0) {
					showdate=jshour == 1?`${jshour} hr ago`:`${jshour} hrs ago`
				} else if (jsday > 0 && week == 0) {
					showdate=jsday == 1?`${jsday} day ago`:`${jsday} days ago`
				} else if (0 < week && month == 0) {
					showdate=week == 1?`${week} week ago`:`${week} weeks ago`
				} else if (0 < month && year == 0) {
					showdate=month==1?`${month} month ago`:`${month} months ago`
				} else if (year > 0) {
					showdate=year==1?`${year} year ago`:`${year} years ago`
				}
				return showdate;
			}
		}
	})
</script>

<style scoped lang="scss">
	.list-box{
		margin:20px 0;
		padding:10px;
		border-radius: $border-radius-sm;
		border:1px solid $text-color-four;
		display: flex;
		.img-box{
			width: 135px;
			height: 135px;
			.img{
				width: 135px;
				height: 135px;
			}
		}
		.centent-box{
			width: 1000px;
			margin:0 20px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
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
				
				p:first-child{
					flex: 1;
					@include heightHidden;
				}
				p:last-child{
					width: 50px;
					text-align: center;
					color: $text-color-brand;
					cursor: pointer;
				}
			}
		}
		.right-box{
			width: 200px;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.copy-box{
				position: relative;
				width: 106px;
				cursor: pointer;
				.copy{
					display: flex;
					margin-top: 20px;
					
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
					top:45px;
					border:5px;
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
</style>
