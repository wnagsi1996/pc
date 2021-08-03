<template>
	<div>
		<Header />
		<div class="coninter">
			<userMenu class="userMenu" />
			<div class="list">
				<el-row :gutter="12">
					<el-col class="col-node" :span="12">
						<el-card shadow="never">
							<div class="cart-body cart-body-null" @click="_handSedAddress()">
								<i class="el-icon-plus"></i>
							</div>
						</el-card>
					</el-col>
					<el-col class="col-node" :span="12" v-for="item in list" :key="item.rid">
						<AddressInfo :infodata="item" @editaddress="_handSedAddress" @deladdress="_handDeladdress"
						@defaultaddress="_handDefaultaddress"></AddressInfo>
					</el-col>
				</el-row>
			</div>
		</div>
		<Footer />
		<el-dialog
		  title="Address"
		  :visible.sync="addVisible"
		  width="700px"
		  :before-close="handleAddressClose">
		  <!-- <AddressItem :addressId="addressId" @updateAddress="handleAddressClose" /> -->
		  <comment :is="addressItemCom" :addressId="addressId" @updateAddress="handleAddressClose"></comment>
		</el-dialog>
	</div>
</template>

<script>
	import userMenu from '@/components/userMenu'
	import {Dialog,Card} from 'element-ui'
	import {address} from '@/mixins/address.js'
	export default({
		name:'MyAddress',
		mixins:[address],
		components:{
			userMenu,
			[Dialog.name]:Dialog,
			[Card.name]:Card,
			AddressInfo:()=>import('@/components/AddressInfo')
		},
		data(){
			return{
				addVisible:false,
				addressId:'',
				addressItemCom:null
			}
		},
		created() {
			this.getAddressList()
		},
		methods:{
			_handSedAddress(rid=''){
				if(this.addressItemCom==null){
					this.addressItemCom=()=>import('@/components/AddressItem')
				}
				this.addressId=rid;
				this.addVisible=true
			},
			//关闭地址弹框，istype判断是否更新地址
			handleAddressClose(istype=false){
				this.addVisible=false;
				if(typeof istype=='boolean'){
					this.getAddressList();
				}
			},
		}
	})
</script>

<style lang="scss" scoped>
	.coninter{
		display: flex;
		.list{
			flex: 1;
			margin-left: 30px;
			.col-node{
				margin: 0 0 16px;
				.cart-body-null{
					height: 156px;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					.el-icon-plus{
						font-size: $text-size-2x;
						color:$text-color-three;
					}
				}
			}
			
		}
	}
	
</style>
