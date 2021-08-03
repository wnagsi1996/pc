<template>
	<div>
		<div class="attr-node" v-for="(item,index) in skuAttr" :key="index">
			<div class="title">{{item.name}}</div>
			<div class="attr-node-item">
				<div class="attr-item" v-for="(n,i) in item.children" :key="i">
					<template v-if="n.imgs=='' || !n.imgs">
						<p :class="{active:n.isCheck,disabled:n.isnull}" @click="_handSelectAttr(item.name,n.name,n.isCheck,n.isnull)">{{n.name}}</p>
					</template>
					<template v-else>
						<el-tooltip :content="n.name" placement="top" effect="light">
						  <el-image :src="n.imgs"  fit="scale-down" class="el-img" :class="{active:n.isCheck,disabled:n.isnull}" style="width:40px;height:40px"
						  @click="_handSelectAttr(item.name,n.name,n.isCheck,n.isnull)"></el-image>
						</el-tooltip>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {Tooltip} from 'element-ui'
	export default({
		name:'ProductDetail',
		components:{
			[Tooltip.name]:Tooltip
		},
		props:{
			//接收sku数据
			skuData:{
				type:Object,
				default:new Object()
			},
			//sku信息给父组件更新
			skuInfo:{
				type:Object,
				default:new Object()
			}
		},
		data(){
			return{
				skuAttr:[],  //改造后sku
				skuAttrOld:[],  //sku
				checkSku:{}  ,//选中SKU信息,
				selectArr:[],  //存放选中的值
				newSkuInfo:[]
			}
		},
		created() {
			this.skuAttrFun()
		},
		methods:{
			skuAttrFun(){
				if(Object.keys(this.skuData).length==0) return ;
				let {SKUInfos,attrConfig}=this.skuData;
				let skuAttr=[]
				attrConfig.forEach(n=>{
					let attr=[]
					SKUInfos.forEach(nn=>{
						if(!attr.some(item=>item.name==nn[n.dataIndex])){
							attr.push({
								name:nn[n.dataIndex],
								imgs:nn[n.dataIndex+'_simg'],
								imglg:nn[n.dataIndex+'_bimg'],
								isCheck:false,
								isnull:false
							})
						}
					})
					skuAttr.push({name:n.title,children:attr,isCheck:false});
				});
				this.skuAttr=skuAttr;
				this.skuAttrOld=this.skuData;
			},
			//选中属性
			_handSelectAttr(parnName,name,check,isnull){
				if(isnull) return ;
				let skuAttr=this.skuAttr;
				let skuAttrOld=this.skuAttrOld;
				let selectattr={};  //存新的数据
				skuAttr.forEach(n=>{
					if(n.name==parnName){
						n.isCheck=!check
						n.children.forEach(nn=>{
							if(nn.name==name){
								nn.isCheck=!nn.isCheck
								if(nn.imglg!=''){
									selectattr.showImg=nn.isCheck?nn.imglg:''
									// this.imgShow=nn.isCheck?nn.imglg:this.imgsLg[0];
								}
							}else{
								nn.isCheck=false
							}
						})
					}
				});
				let selectArr=[]  //存放已选的属性
				let attrsku1=[]  //存放当前点击的整行属性
				skuAttr.forEach(n=>{
					if(n.isCheck){
						n.children.forEach(k=>{
							attrsku1.push(k.name)  
						})
					}
					if(n.isCheck){
						selectArr.push(n.children.find(k=>k.isCheck).name)
					}
				})
				
				//判断是否取消到为0，是就全部清空
				if(selectArr.length==0){  
					skuAttr.forEach(n=>{
						n.children.forEach(m=>{
							m.isnull=false
						})
					})
					selectattr={}
				}else{
					let attrsku2=[]  
					//遍历整个sku数据
					skuAttrOld.SKUInfos.forEach(n=>{
						let allattr=n.res_skuattrall.split('^');
						//遍历已选的属性名称
						selectArr.forEach(item=>{ 
							//判断已选是否在单条sku数据中
							if(allattr.some(m=>m==item)){
								//遍历sku中有的属性
								for(let k of allattr){
									//判断库存是否大于0
									if(n.kc>0){
										//把有遍历到的属性名称全部添加进去，后面在过滤
										attrsku2.push(k)
									}
									
								}
							}
						})
					})
					//第一次添加就把点击的整行加上遍历出来的合并一起去重，不是第一次就只去重遍历出来的
					if(selectArr.length==1){
						attrsku2=[...new Set([...attrsku1,...attrsku2])]
					}else{
						attrsku2=[...new Set(attrsku2)]
					}
					
					//重新遍历新构成的sku试图，把没有符合的就把他标记为true，添加不可点击
					skuAttr.forEach(n=>{
						n.children.forEach(m=>{
							// console.log(attrsku2.some(k=>k==m))
							if(!attrsku2.some(k=>k==m.name)){
								m.isnull=true
							}else{
								m.isnull=false
							}
						})
					})
				}
				
				this.skuAttr=skuAttr;
				
				let allCheck=skuAttr.every(n=>n.isCheck);//是否全部选完
				if(allCheck){
					let attrStr='';
					skuAttr.forEach(n=>{
						if(n.isCheck){
							attrStr+=n.children.find(item=>item.isCheck).name+'^'
						}
					})
					attrStr=attrStr.substring(0,attrStr.length-1);
					this.checkSku=skuAttrOld.SKUInfos.filter(item=>item.res_skuattrall==attrStr)[0];
					Object.assign(selectattr,this.checkSku)
					// this.num=this.num>this.checkSku.kc?this.checkSku.kc:this.num;
					// this.skuInfo[num]=this.checkSku.kc
				}else{
					this.checkSku={}
					// this.newSkuInfo['sku']=this.checkSku
					
				}
				this.newSkuInfo=Object.assign({},selectattr);
				this.$emit('update:skuInfo',this.newSkuInfo)
			},
		},
		watch:{
			skuData(){
				this.skuAttrFun()
			}
		}
	})
</script>

<style lang="scss" scoped>
	.attr-node{
		margin:20px 0;
		display: flex;
		flex-direction: column;
		.attr-node-item{
			margin-top: 15px;
			display: flex;
			flex-wrap: wrap;
			.attr-item{
				margin: 0 15px 15px 0;
				cursor: pointer;
				p{
					padding: 5px 12px;
					border: 1px solid $text-color-four;
					border-radius: $border-radius-sm;
				}
				.el-img{
					border: 1px solid $text-color-four;
					border-radius: $border-radius-sm;
				}
				.active{
					border: 2px solid $text-color-brand;
				}
				.disabled {
					cursor: default;
					color: $text-color-two;
					background-color:#f7f7f7;
					opacity: .5;
				}
			}
		}
	}
</style>
