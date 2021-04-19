<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterNestedList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}

                <span class="acts">
                    <el-button type="text" @click="showVideoForm(chapter.id)">添加小节</el-button>
                    <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                            <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
        <el-form :model="video" label-width="120px">
            <el-form-item label="小节标题">
                <el-input v-model="video.title"/>
            </el-form-item>
            <el-form-item label="小节排序">
                <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
        </div>
    </el-dialog>

    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 分页 -->
        <!-- <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="init"
        /> -->

  </div>
</template>

<script>
import chapterApi from '@/api/chapter'
import videoApi from '@/api/video'

const chapterObj = {// 章节对象
        title: '',
        sort: 0
      }
const videoObj = {// 章节对象
  chapterId: '',
  title: '',
  sort: 0
}

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '',
      chapterNestedList: [],
      dialogChapterFormVisible: false, //是否显示章节表单
      dialogVideoFormVisible: false,
      chapter: {...chapterObj}, //章节对象
      // limit: 10,
      // page: 1
      video: {...videoObj}


    }
  },

  created() {
    console.log('chapter created'),
    this.init()
  },

  methods: {
    init(){
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        //查询
        chapterApi.getChapterAndVideo(this.courseId)
        .then( response => {
          if(response.success === true){
            this.chapterNestedList = response.data.items
          }else{
            this.$message({
              type: 'error',
              message: response.message
            })
          }
        })
      }
    },

    saveOrUpdate(){
      this.saveBtnDisabled = true
      if(!this.chapter.id){
        console.log('准备添加')
        this.saveChapter()
      }else{
        console.log('准备修改')
        this.updateChapter()
      }
    },

    saveChapter(){
      this.chapter.courseId = this.courseId
      console.log('this.chapter=')
      console.log(this.chapter)
      chapterApi.save(this.chapter)
      .then(response => {
        console.log('保存response：')
        console.log(response)
        if(response.success === true){
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.cleanState()
        }
      })
      .catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },

    cleanState(){
      console.log('清除表单数据')
      this.dialogChapterFormVisible = false// 如果保存成功则关闭对话框
      this.chapter = {...chapterObj}
      this.video = {...videoObj}
      this.dialogVideoFormVisible = false
      console.log('清除表单数据成功')
      this.init()// 刷新列表
    },

    editChapter(chapterId){
      this.dialogChapterFormVisible = true
      //获取chapter信息用于回显
      chapterApi.getChapterById(chapterId)
      .then(response => {
        this.chapter =  response.data.item
      })
    },

    updateChapter(){
      chapterApi.update(this.chapter)
      .then(response => {
        if(response.success === true){
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
        this.cleanState()
      })
      .catch(response => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },

    removeChapter(chapterId){
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapterApi.deleteById(chapterId)
      }).then(() => {
        this.init()// 刷新列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },

    // fetchChapterNestedListByCourseId() {
    //   chapter.getChapterAndVideo(this.courseId).then(response => {
    //     this.chapterNestedList = response.data.items
    //   })
    // },

    

    showVideoForm(chapterId){
      this.video.chapterId = chapterId
      this.video.courseId = this.courseId
      this.dialogVideoFormVisible = true
    },

    saveOrUpdateVideo(){
      if(this.video.id){
        //修改小节
        console.log('准备修改小节')
        console.log(this.video.id)
        videoApi.updateVideo(this.video)
        .then(response => {
          if(response.success === true){
            this.$message({
              type: 'success',
              message: '修改课时成功'
            })
            this.cleanState()
          }else{
            this.$message({
              type: 'info',
              message: response.message
            })
          }
        })
        .catch(response => {
          this.$message({
              type: 'error',
              message: '网络异常'
            })
        })

      }else{
        //新建小节
        console.log('准备新建小节')
        videoApi.saveVideo(this.video)
        .then(response => {
          if(response.success === true){
            this.$message({
              type: 'success',
              message: '添加课时成功'
            })
          }else{
            this.$message({
              type: 'info',
              message: response.message
            })
          }
          this.cleanState()

        })

      }
    },

    editVideo(id){
      console.log('准备修改,先回显')
      console.log('videoId=')
      console.log(id)
      videoApi.getVideo(id)
      .then(response => {
        if(response.success === true){
          console.log('success')
          this.video = response.data.item
          this.dialogVideoFormVisible = true
        }else{
          console.log('error')
          this.$message({
            type: 'info',
            message: response.message
          })
        }
      })
    },

    removeVideo(id){
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return videoApi.deleteById(id)
      }).then(() => {
        this.init()// 刷新列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },

    previous() {
      console.log('previous')
      console.log(this.courseId)
      this.$router.push({ path: '/course/info/'+this.courseId })
    },

    next() {
      console.log('next')
      console.log('下一步，'+this.courseId)
      this.$router.push({ path: '/course/publish/'+this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>