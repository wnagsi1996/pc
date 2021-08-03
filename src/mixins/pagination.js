export const paginationsMi={
	data(){
		return{
			list:[],
			listObj:{},
			index:0
		}
	},
	created() {
		this.load()
	},
	methods:{
		currentChange(val){
			this.index=val
			this.load()
		}
	}
}