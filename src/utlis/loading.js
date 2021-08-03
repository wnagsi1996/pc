import { Loading } from 'element-ui';

class loadStatus{
	constructor() {
	    this.isload=false;
		this.loadingInstance=null
	}
	load(){
		this.isload=true
		this.loadingInstance = Loading.service({
			lock: true,
			text: 'Loading',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.3)'
		});
	}
	unLoad(){
		this.isload=false
		this.loadingInstance.close();
	}
}

export default new loadStatus();