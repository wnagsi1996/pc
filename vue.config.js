module.exports={
	productionSourceMap: false,  //在编译时不生成.map文件
	publicPath: process.env.NODE_ENV=='production'? "../pc":'/',
	outputDir:'pc',
	devServer:{
		host: "192.168.123.122",
		port: "8091",
		proxy:{
			'/Handler':{
				//target:'https://www.isharelike.com',
				 target:'http://192.168.123.122',
				changeOrigin:true,
				pathRewrite:{
					'^/Handler':''
				}
			}	
		}
	},
	css: {
		sourceMap:true,
	    loaderOptions: {
	      sass: {
	        prependData: `@import "~@/assets/scss/style.scss";`
	      }
	    }
	  }
}