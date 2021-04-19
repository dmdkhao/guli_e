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
                    <el-button type="text">添加课时</el-button>
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
                            <el-button type="text">编辑</el-button>
                            <el-button type="text">删除</el-button>
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

    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import chapterApi from '@/api/chapter'

const chapterObj = {// 章节对象
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
      chapter: chapterObj //章节对象


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
        this.saveChapter()
      }else{
        this.updateChapter()
      }
    },

    saveChapter(){
      this.chapter.courseId = this.courseId
      console.log('this.chapter=')
      console.log(this.chapter)
      chapterApi.save(this.chapter)
      .then(response => {
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
      this.dialogChapterFormVisible = false// 如果保存成功则关闭对话框
      this.fetchChapterNestedListByCourseId()// 刷新列表
      this.chapter.title = ''// 重置章节标题
      this.chapter.sort = 0// 重置章节标题
      this.saveBtnDisabled = false
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
        this.fetchChapterNestedListByCourseId()// 刷新列表
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

    fetchChapterNestedListByCourseId() {
      chapter.getChapterAndVideo(this.courseId).then(response => {
        this.chapterNestedList = response.data.items
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