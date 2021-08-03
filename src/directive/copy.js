import {Message } from 'element-ui'
export const copy={
	bind(el,{value}){
		
		el.$value=value;
		el.handler=()=>{
			if(!el.$value) return;
			const textarea=document.createElement('textarea');
			// textarea.readOnly='readonly',  //防止iso吊起键盘
			textarea.style.position='absolute'
			textarea.style.left="-99999px";
			textarea.style.top='-99999px';
			textarea.value=el.$value;
			document.body.appendChild(textarea);
			textarea.select();
			 textarea.setSelectionRange(0, textarea.value.length);
			 document.execCommand('SelectAll')
			 const result=document.execCommand('Copy');
			 if(result){
				 Message.success('Copy Success')
			 }
			 document.body.removeChild(textarea);
		}
		el.addEventListener('click',el.handler)
	},
	componentUpdated(el,binding){
		el.$value = binding.value
	},
	unbind(el){
		el.removeEventListener('click',el.handler)
	}
}