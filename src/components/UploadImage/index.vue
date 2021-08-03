<template>
	<div class="upload">
		<div class="upload-box">
			<div class="upload-null" v-if="!img"></div>
			<div class="cropper-box" v-if="img">
				<div class="cropper">
					<vue-cropper
					  ref="cropper"
					  :img="img"
					  :info="true"
					  :original="true"
					  :autoCrop="options.autoCrop"
					  :autoCropWidth="options.autoCropWidth"
					  :autoCropHeight="options.autoCropHeight"
					  :fixedBox="options.fixedBox"
					  @realTime="realTime"
					></vue-cropper>
				</div>
				<div class="operating-btn">
					<el-button size="mini" icon="el-icon-refresh-right" @click="changeRotate('right')"></el-button>
					<el-button size="mini" icon="el-icon-refresh-left" @click="changeRotate('left')"></el-button>
					<el-button size="mini" icon="el-icon-plus"  @click="changeScale(1)"></el-button>
					<el-button size="mini" icon="el-icon-minus"  @click="changeScale(-1)"></el-button>
				</div>
			</div>
			<div class="view-avatar">
				<img class="el-image" :src="previews.url" :style="previews.img"  v-if="img"/>
			</div>
		</div>
		<div class="cropper-btn">
			<div class="cropper-btn-upload">
				<el-upload
				  class="upload-demo"
				  action=""
				  :show-file-list="false"
				  :auto-upload="false"
				  :on-change="changeUpload"
				  :file-list="fileList"
				  list-type="picture">
				  <el-button class="upload-btn btn">Upload</el-button>
				</el-upload>
			</div>
			<div><el-button class="btn"  type="warning" @click="_handCancel">Cancel</el-button></div>
			<div><el-button class="btn" type="primary" :loading="loading" @click="_handUpload">Save</el-button></div>
		</div>
	</div>
</template>

<script>
	import { VueCropper }  from 'vue-cropper' 
	import {Upload} from 'element-ui'
	import {mapActions} from 'vuex'
	export default({
		name:'UploadImage',
		components:{
			VueCropper,
			[Upload.name]:Upload
		},
		data(){
			return{
				img:null,
				options: {
					autoCrop: true, //是否默认生成截图框
					autoCropWidth: 200, //默认生成截图框宽度
					autoCropHeight: 200, //默认生成截图框高度
					fixedBox: true, //固定截图框大小 不允许改变
				  },
				  fileList:[],
				  fileinfo:{},
				  previews:{},
				  loading:false
			}
		},
		methods:{
			// 上传按钮   限制图片大小
			changeUpload(file, fileList) {
			  const isLt5M = file.size / 1024 / 1024 < 5
			  if (!isLt5M) {
				this.$message.error('上传文件大小不能超过 5MB!')
				return false
			  }
			  this.fileinfo = file
					
			  // 上传成功后将图片地址赋值给裁剪框显示图片
			  this.$nextTick(() => {
				this.img = file.url
				this.dialogVisible = true
			  })
			},
			//放大缩小
			changeScale(num){
				this.$refs.cropper.changeScale(num)  //修改图片大小 正数为变大 负数变小
			},
			changeRotate(align){
				if(align=='right'){
					this.$refs.cropper.rotateRight() //向右边旋转90度
				}
				if(align=='left'){
					this.$refs.cropper.rotateLeft() //向右边旋转90度
				}
			},
			//预览
			realTime(data){
				this.previews=data;
			},
			//取消上传
			_handCancel(){
				this.fileinfo={}
				this.previews={}
				this.img=null
				this.$emit('dialogClose')
			},
			//上传
			_handUpload(){
				this.loading=true
				this.$refs.cropper.getCropData((data) => {
					this.$api.user.UploadHeadimg({_img64:data}).then(res=>{
						console.log(res)
						if(res.fsstate==0){
							this.$message.success('Upload Success.')
							setTimeout(()=>{
								this.fileinfo={}
								this.previews={}
								this.img=null
								this.getUserInfo();
								this.getUserCenterInfo();
								this.$emit('dialogClose',true)
							},1000)
						}else{
							this.$message.error(res.fsmes);
						}
						this.loading=false
					}).catch(err=>{
						this.loading=false
						this.$message.error('Upload Fail');
					})
				 })
			},
			...mapActions({
				getUserCenterInfo:'userInfo/getUserCenterInfo',
				getUserInfo:'userInfo/getUserInfo'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.upload{
		width: 750px;
		.upload-box{
			display: flex;
			align-items: center;
			.upload-null{
				width: 300px;
				height:300px;
				background-color: #f7f7f7;
			}
			.cropper-box{
				width: 300px;
				.cropper{
					width: 300px;
					height: 300px;
				}
				.operating-btn{
					margin-top: 20px;
				}
			}
		}
		
		.view-avatar{
			margin-left: 100px;
			width: 200px;
			height: 200px;
			border-radius: 50%;
			box-shadow: $box-shadow-deep;
			overflow: hidden;
			.el-image{
				width: 200px;
				height: 200px;
			}
		}
		.cropper-btn{
			text-align: right;
			display: flex;
			align-items: flex-end;
			justify-content: flex-end;
			.btn{
				width: 100px;
				margin:10px ;
			}
		}
	}
	
</style>
