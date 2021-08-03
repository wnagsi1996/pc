export const address={
	data(){
		return{
			list:[]
		}
	},
	
	methods:{
			//获取地址
			async getAddressList(){
				this.$loading.load()
				const res=await this.$api.user.GetAddress();
				if(res.rows.length>0){
					this.list=res.rows
				}
				this.$loading.unLoad()
			},
			//设为默认
			_handDefaultaddress(rid){
				this.$api.user.selDefaultAddress({rid}).then(res=>{
					if(res>0){
						this.$message.success('Set success.');
						this.getAddressList()
					}else{
						this.$message.error('Set failed. Please try again.');
					}
				})
			},
			//删除地址
			_handDeladdress(rid){
				if(rid!=''){
					 this.$confirm('You have to address is deleted', 'Delect Info', {
						  confirmButtonText: 'Yes',
						  cancelButtonText: 'No',
						  type: 'warning'
						}).then(async () => {
						    const res=await this.$api.user.DelAddress({rid})
							if(res>0){
								this.$message.success('Delete successfully.')
								this.list=this.list.filter(n=>n.rid!=rid)
							}else{
								this.$message.error('Deletion failed. Please try again')
							}
						}).catch(() => {});
					
				}else{
					this.$message.error('Select the address to delete')
				}
			}
	}
}