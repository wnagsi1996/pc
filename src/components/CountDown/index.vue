<template>
	<div>
		{{txt}}
	</div>
</template>

<script>
	export default({
		name:'CountDown',
		props:{
			time:{
				type:Number,
				default:0
			},
			isminisecond:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				txt:'',
				timer:null
			}
		},
		created() {
			this.setCountdown()
		},
		methods:{
			setCountdown(){
				let djs=this.time*1000
				this.timer=setInterval(()=>{
					if(djs<=0){
						clearInterval(this.timer)
						if(this.time!=0){  //一开始传的就是0就不触发
							this.$emit('finish',0)  //倒计时结束时触发
						}
						
					}else{
						this.txt=this.countdown(djs,this.isminisecond)
						djs-=10
					}
				},10)
			},
			countdown(time,isminisecond=false){
				let day=Number.parseInt(time/1000/(24*60*60));
				let hour=Number.parseInt(time/1000/60/60%24);
				let min=Number.parseInt(time/1000/60%60);
				let second=Number.parseInt(time/1000%60);
				let minisecond=Number.parseInt(time%1000);  //毫秒
				let str=''
				hour=hour<10?`0${hour}`:hour
				min=min<10?`0${min}`:min
				second=second<10?`0${second}`:second
				 minisecond=minisecond<100?`0${second}`:minisecond
				if(day>0){
					str=`${day} day:`
				}
				if(isminisecond){
					return `${str}${hour}:${min}:${second}:${minisecond}`;
				}else{
					return `${str}${hour}:${min}:${second}`;
				}
				
			}
		},
		watch:{
			time(){
				this.timer=null;
				this.setCountdown()
			}
		}
	})
</script>

<style>
</style>
