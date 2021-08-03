<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
	export default({
		name:'app',
		provide(){
			return{
				reload:this.reload
			}
		},
		data(){
			return{
				isRouterAlive:true
			}
		},
		mounted() {
				
		},
		methods:{
			reload(){
				this.isRouterAlive=false;
				this.$nextTick(()=>{
					this.isRouterAlive=true;
				})
			}
		}
	})
</script>
<style lang="scss">
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 14px;
		// font: inherit;
		vertical-align: baseline;
		font-weight: normal;
		font-style: normal;
		font-family: Arial, Helvetica, sans-serif;
	}
	html,body{
		font-family: Arial,Helvetica,Helvetica Neue;
		//background-color: #f7f7f7;
	}
	.coninter{
		width: 1400px;
		min-height: 320px;
		margin: 20px auto;
	}
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}
	body {
		line-height: 1;
	}
	ol, ul {
		list-style: none;
	}
	a{
		text-decoration: none;
		color:$text-color-one;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	
	
</style>
