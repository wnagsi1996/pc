<template>
	<div>
		<Header />
		<div class="coninter">
			<div class="header">
				<div class="node">
					<div class="name">FILTER</div>
					<div class="offers">{{total}} Offers</div>
				</div>
				<div class="node-box">
					<div class="item" @click.stop="_handMenu(1)">
						
						<span :class="{check:check1}"><i class="el-icon-star-on"></i> Staff Pick</span>
					</div>
					<div class="item" @click.stop="_handMenu(2)">
						<el-dropdown trigger="click" placement="bottom"  @command="_handSelMenu">
							<span :class="{check:check2}">{{CategoryText}} <i class="el-icon-arrow-down"></i></span>
							 <el-dropdown-menu slot="dropdown" style="height: 300px;overflow: auto;">
								<el-dropdown-item v-for="(item,index) in catelist" :key="index" :command="{i:0,val:item.val}">{{item.text}}</el-dropdown-item>
							  </el-dropdown-menu>
						</el-dropdown>
					</div>
					<div class="item" @click.stop="_handMenu(3)">
						<el-dropdown trigger="click" placement="bottom" @command="_handSelMenu">
							<span :class="{check:check3}">{{StoreText}} <i class="el-icon-arrow-down"></i></span>
							
						<el-dropdown-menu slot="dropdown" style="height: 300px;overflow: auto;">
								<el-dropdown-item v-for="(item,index) in storelist" :key="index" :command="{i:1,val:item.val}">{{item.text}}</el-dropdown-item>
							  </el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</div>
			<div class="content">
				<template v-if="list && list.length>0">
					<div v-for="item in list" :key="item.rid">
						<dealsSimple :item="item" v-show="!item.showDetail" @_handShowDetail="_handShowDetail"></dealsSimple>
						<dealsDetailed :item="item" v-show="item.showDetail" @hideDetail="_handHideDetail"></dealsDetailed>
					</div>
					
					<Pagination :total="totalNum" @currentChange="currentChange" />
				</template>
				<template v-else>
					<div class="empty-box">Data is empty</div>
				</template>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	let timer=null; //点击事件
	import {catelist,storelist} from '@/assets/js/deal.js'
	import {DropdownMenu,DropdownItem,Dropdown} from 'element-ui'
	import {paginationsMi} from '@/mixins/pagination.js'
	export default({
		name:'dealsList',
		mixins:[paginationsMi],
		components:{
			[DropdownMenu.name]:DropdownMenu,
			[DropdownItem.name]:DropdownItem,
			[Dropdown.name]:Dropdown,
			Pagination:()=>import('@/components/Pagination/index.vue'),
			dealsSimple:()=>import('@/components/Deals/simple.vue'),
			dealsDetailed:()=>import('@/components/Deals/detailed.vue')
		},
		data(){
			return{
				check1:false,
				check2:false,
				check3:false,
				catelist,
				storelist,
				formdata:{
					sptitle:'', //sptype分类  platid平台  pick员工推荐  popul热度
					sptype:'',
					platid:'-1',
					pick:'-1',
					popul:'-1'		
				},
				totalNum:0,
				morelist:[]
			}
		},
		computed:{
			total(){
				return this.totalNum>1000?'1000+':this.totalNum
			},
			CategoryText(){
				const {sptype}=this.formdata;
				const check=catelist.find(n=>n.val==sptype);
				return sptype==''?'Category':check.text
			},
			StoreText(){
				const {platid}=this.formdata;
				const check=storelist.find(n=>n.val==platid);
				return platid=='-1'?'Store':check.text
			}
		},
		mounted() {
			document.onclick=()=>{
				const {sptype,platid}=this.formdata;
				this.check2=sptype==''?false:true
				this.check3=platid=='-1'?false:true
			}
		},
		methods:{
			async load(){
				this.$loading.load();
				const params=Object.assign({},this.formdata,{pageindex:this.index})
				const res=await this.$api.product.getDealsList(params);
				this.$loading.unLoad();
				if(res){
					res.rows.forEach(n=>{
						if(n.code!=''){
							n.showCode=false
						}
						n.showDetail=false
						// n.list=[]
					})
					this.list=res.rows;
					this.totalNum=res.results;
				}
			},
			//显示折扣吗
			_handShowCode(rid){
				this.list.forEach(n=>{
					if(n.rid==rid){
						n.showCode=true
						//判断是否已经点击过，有就取消隐藏，从新计算
						if(timer){
							clearTimeout(timer)
						}
						timer=setTimeout(()=>{
							n.showCode=false
						},3000)
					}
				})
			},
			//点击选中
			_handMenu(num){
				if(num==1){
					this.formdata.pick=this.formdata.pick=='1'?'-1':1;
					this.check1=!this.check1;
					this.load();
				}else if(num==2){
					const {sptype}=this.formdata;
					this.check2=sptype!=''?true:!this.check2
				}else if(num==3){
					const {platid}=this.formdata;
					this.check3=platid!='-1'?true:!this.check3
				}
			},
			//选择分类
			_handSelMenu(item){
				if(item.i==0){
					if(item.val==''){
						this.check2=false
					}
					this.formdata.sptype=item.val
				}else{
					if(item.val=='-1'){
						this.check3=false
					}
					this.formdata.platid=item.val
				}
				this.load();
			},
			//显示详细
			_handShowDetail(params){
				let rows=this.list;
				rows.forEach((n,i)=>{
					if(n.rid==params.did){
						n.showDetail=true;
						// this.list[i]=Object.assign({},this.list[i],n)
						if(!n.list){
							this.getDealsListByTypeID(params)
						}
					}
				})
				this.list=[];
				this.list=rows;
			},
			//隐藏详细
			_handHideDetail(rid){
				let rows=this.list;
				rows.forEach((n,i)=>{
					if(n.rid==rid){
						n.showDetail=false;
						// this.list[i]=Object.assign({},this.list[i],n)
					}
				})
				this.list=[];
				this.list=rows;
			},
			async getDealsListByTypeID(params){
				const res=await this.$api.product.getDealsListByTypeID(params);
				let rows=this.list;
				rows.forEach((n,i)=>{
					if(n.rid==params.did){
						n.list=res.rows;
						this.list[i]=Object.assign({},this.list[i],n)
					}
				});
				this.list=[];
				this.list=rows;
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

<style lang="scss" scoped>
	.header{
		.node{
			@include flexBetweeCenter;
			position: relative;
			.name{
				width: 150px;
				height: 35px;
				line-height: 35px;
				text-align: center;
				border:1px solid $text-color-four;
				border-bottom: none;
				border-radius: $border-radius-sm $border-radius-sm 0 0;
			}
			&::after{
				content: '';
				position: absolute;
				left: 1px;
				bottom:-2px;
				width: 150px;
				height: 2px;
				background-color: #fff;
			}
		}
		.node-box{
			border:1px solid $text-color-four;
			border-radius:0 $border-radius-sm $border-radius-sm;
			display: flex;
			
			.item{
				margin:20px 10px;
				border-radius: $border-radius-lg;
				overflow: hidden;
				cursor: pointer;
				color:#606266;
				span{
					border:1px solid $text-color-four;
					border-radius: $border-radius-lg;
					padding:5px 12px;
					display: block;
					&.check{
						background-color: $bj-color-brand;
						color: #fff !important;
						
					}
				}
				
			}
		}
	}
	.content{
		min-height: 200px;
		.empty-box{
			margin-top: 20px;
		}
	}
</style>
