/*
type:类别,
key:操作的名称,
val:操作就的值,只对设置有用,
*/
const localStorage=(type='set',key,val='')=>{
	if(type=='set'){
		window.localStorage.setItem(key,val)
	}else if(type=='get'){
		return window.localStorage.getItem(key)
	}else if(type=='remove'){
		window.localStorage.removeItem(key)
	}else if(type=='clear'){
		window.localStorage.clear()
	}
}
const sessionStorage=(type='set',key,val='')=>{
	if(type=='set'){
		window.sessionStorage.setItem(key,val)
	}else if(type=='get'){
		return window.sessionStorage.getItem(key)
	}else if(type=='remove'){
		window.sessionStorage.removeItem(key)
	}else if(type=='clear'){
		window.sessionStorage.clear()
	}
}

//设置cookie
const cookie=(type='set',key,val='',day=7)=>{
	
	if(type=='set'){
		let odate=new Date();
		odate.setDate(odate.getDate()+day)
		document.cookie=`${key.trim()}=${val};expires=${odate}`;
	}else if(type=='get'){
		let arr=document.cookie.split(";");
		for(let i=0;i<arr.length;i++){
			let attr1=arr[i].split("=");
			if(attr1[0].trim()==key.trim()){
				return attr1[1]
			}
		}
		return '';
	}else if(type='remove'){
		document.cookie=`${key}=${val};expires=-1`
	}
}

//分享
const share=(name='',uid='')=>{
	let url=`${window.location.href}?u=${uid}`;
	switch (name){
	  case "Facebook":
		window.open('https://www.facebook.com/sharer/sharer.php?' + encodeURIComponent(url) + '&t=' + encodeURIComponent(url));
		break;
	  case "Twitter":
		window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + ':%20'  + encodeURIComponent(url));
		break;
	  case "Messenger":
		window.open('fb-messenger://share?link=' + encodeURIComponent(url) + '&app_id=' + encodeURIComponent(2150569971849396));
		break;
	  case "Pinterest":
		window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url) + '&description=' +  encodeURIComponent(document.title));
		break;
	  case "Linkedin":
		window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url) + '&title=' +  encodeURIComponent(document.title));
		break;
	  case "Whatapp":
		window.open('whatsapp://send?text='+encodeURIComponent(url));
		break;
	  case "Picture":
		window.open('');
		break;
	}
}

//倒计时
const countdown=(time,millisecond=false)=>{
	let day=Number.parseInt(time/(24*60*60));
	let hour=Number.parseInt(time/60/60%24);
	let min=Number.parseInt(time/60%60);
	let second=Number.parseInt(time%60);
	let str=''
	hour=hour<10?`0${hour}`:hour
	min=min<10?`0${min}`:min
	second=second<10?`0${second}`:second
	if(day>0){
		str=`${day} day:`
	}
	return `${str}${hour}:${min}:${second}`;
	
}

export {
	localStorage,
	sessionStorage,
	cookie,
	share,
	countdown
}