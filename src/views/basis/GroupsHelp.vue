<template>
	<div>
		<Header ref="header" />
		<div class="coninter">
			<div class="left-box">
				<el-image class="el-img" :src="orderInfo.shareimg" fit="scale-down" />
			</div>
			<div class="right-box">
				<div class="head">
					<div class="title">{{orderInfo.pname}}</div>
					<div class="orderstate">{{orderInfo | state}}</div>
					<SKU class="skuinfo" :skuData="skudata" :skuInfo.sync="selectSku" />
					<button class="btn" v-if="orderInfo.state==0" @click="_handHelp">HELP & GET</button>
					<button class="btn" v-else >I Also Want This</button>
				</div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default({
		name:'GroupsHelp',
		components:{
			SKU:()=>import('@/components/SKU')
		},
		data(){
			return{
				orderno:this.$route.params.orderno,
				orderInfo:{},
				skudata:{},
				selectSku:{},
				isattr:false
			}
		},
		beforeRouteEnter(to,from,next) {
			if(to.params.orderno==''){
				next(from.fullPath)
			}else{
				next()
			}
		},
		computed:{
			...mapGetters([
				'isLogin'
			])
		},
		created() {
			this.getPDProductOrder_Groups()
		},
		methods:{
			async getPDProductOrder_Groups(){
				const res=await this.$api.product.getPDProductOrder_Groups({pdorderno:this.orderno});
				console.log(res)
				if(res.rescode==0){
					this.orderInfo=Object.assign({},res)
					if(res.state==0){
						this.getAttr(res.pid)
					}
				}else if(res.rescode==4){
					this.$router.push({path:`/groupswait/${res.resdesc}`})
				}
			},
			//获取属性
			getAttr(pid){
				this.$api.product.getSCProductColumnsSKU({pid,ifpd:0}).then(res=>{
					if(res!=''){
						this.skudata=res
						this.isattr=true;
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			async _handHelp(){
				if(!this.isLogin){
					this.$refs.header.showLogin()
					return;
				}
				let checkSku=this.selectSku;
				let {skuid}=this.orderInfo;
				if(this.isattr){
					if(Object.keys(checkSku).length==0){
						this.$message.warning('Select product attributes');
						return;
					}
				}
				const selsku=this.isattr?checkSku.sku:skuid
				const zfinfos = 0.00 + "," + 0.00 + "," + 0 + "," + 0.00 + "," + 0.00 + "," + 0.00 + "," + 0.00 + "," + 0 + "," + 0.00 + "," + 0;
				const zfobj = selsku + "|1|0|" + zfinfos + "|0|0|" + ""; //支付数据
				const res=await this.$api.product.CommitPay_PD({zfobj,pdorderno:this.orderno});
				switch(res.fsstate){
					case 0:
						if(res.fsmes=="")
							this.$message.success('Help Success');
						else{
							this.$router.push({path:`/groupswait/${res.fsmes}?nc=${this.orderInfo.loginname}&=pdnum=1`})
						}
						break;
					case 1:
						this.$message.warning(res.fsmes);
						break;
					case 2:
						this.$refs.header.showLogin()
						break;
				}
			}
		},
		filters:{
			state(item){
				switch(item.state){
					case 0:
						return 'Click HELP&GET to help your friend and get it free now.';
						break;
					case 1:
						return `Congratulations! ${item.loginname} have got the free gift and you can get it free, too.`;
						break;
					case 2:
						return 'Click Invite Friends to invite your friends to help you now.';
						break;
				}
			}
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		display: flex;
		margin:20px auto;
		.left-box{
			width: 500px;
			.el-img{
				width: 500px;
				height: 500px;
			}
		}
		.right-box{
			flex:1;
			margin-left: 20px;
			.orderstate{
				margin:30px 0;
				color: $text-color-brand;
				font-size: $text-size-lg;
			}
			.btn{
				margin:30px auto 0;
				width: 200px;
				height: 60px;
				@include buttonBrand;
				font-size: $text-size-lg;
				
			}
		}
	}
</style>
