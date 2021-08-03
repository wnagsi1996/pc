export const title={
	inserted(el, {value}) {
		if(value){
			 document.title = value
		}
	},
	update(el,{value}){
		if(value){
			document.title = value
		}
	}
}