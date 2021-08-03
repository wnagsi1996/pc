<template>
	<el-card shadow="never">
	   <div class="cart-body">
			<div class="name flex">
				<p>{{infodata.lastname}}</p>
				<p>{{infodata.firstname}}</p>
				<p class="red" v-if="infodata.mrdz==1">(Default Address)</p>
			</div>
			<div class="desc flex">
				{{infodata.xxdz}}
			</div>
			<div class="flex">
				<p>{{infodata.city}}</p>
				<p>{{infodata.county}}</p>
				<p>{{infodata.province}}</p>
			</div>
			<div class="flex">
				{{infodata.postcode}}
			</div>
			<div class="flex">
				{{infodata.lxfs}}
			</div>
			<!-- <div class="flex" v-if="item.sns">
				SNS:{{item.sns}}
			</div> -->
		</div>
		<div class="btn">
			<el-link class="link" :underline="false" type="primary" @click="_handSedAddress(infodata.rid)">Edit</el-link>
			<el-link class="link" :underline="false" type="primary" @click="onDel(infodata.rid)">Del</el-link>
			<el-link v-if="infodata.mrdz==0" class="link" :underline="false" type="primary" @click="onDefault(infodata.rid)">Set Default</el-link>
			<el-link v-if="pddz" class="link" :underline="false" type="primary" @click="onSetAddress(infodata.rid)">Set Address</el-link>
		</div>
	</el-card>
</template>

<script>
	import {Card,Link} from 'element-ui'
	export default({
		name:'AddressInfo',
		components:{
			[Card.name]:Card,
			[Link.name]:Link
		},
		props:{
			infodata:Object,
			pddz:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			//编辑
			_handSedAddress(rid){
				this.$emit('editaddress',rid)
			},
			//删除
			onDel(rid){
				this.$emit('deladdress',rid)
			},
			//设为默认
			onDefault(rid){
				this.$emit('defaultaddress',rid)
			},
			//设置拼单地址
			onSetAddress(rid){
				this.$emit('setAddress',rid)
			}
		}
	})
</script>

<style scoped lang="scss">
	.cart-body{
		.flex{
			display: flex;
			align-items: center;
			margin:4px 0;
			line-height: 24px;
			p{
				padding-right: 10px;
				&.red{
					color:$text-color-brand;
				}
			}
		}
	}
	.btn{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.link{
			margin-left: 20px;
		}
	}
</style>
