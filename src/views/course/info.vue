<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

        <el-form-item label="课程标题">
            <el-input v-model="courseInfo.course.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>

        <!-- 所属分类 TODO -->
        <!-- 一级分类 -->
        <el-form-item label="课程类别">
            <el-select
                @change="subjectLevelOneChanged"
                v-model="courseInfo.course.subjectParentId"
                placeholder="请选择">
                <el-option
                v-for="subject in subjectNestedList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>
            <!-- 二级分类 -->
            <el-select v-model="courseInfo.course.subjectId" placeholder="请选择">
            <el-option
                v-for="subject in subSubjectList"
                :key="subject.value"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>
        </el-form-item>

        <!-- 课程讲师 TODO -->
        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
        <el-select
            v-model="courseInfo.course.teacherId"
            placeholder="请选择">
            <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
        </el-form-item>

        <el-form-item label="总课时">
            <el-input-number :min="0" v-model="courseInfo.course.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介-->
        <el-form-item label="课程简介">
            <tinymce :height="300" v-model="courseInfo.courseDescription.description"/>
        </el-form-item>

        <!-- 课程封面 TODO -->
        <!-- 课程封面-->
        <el-form-item label="课程封面">

          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduservice/oss/upload?host=cover'"
            class="avatar-uploader">
            <img :src="courseInfo.course.cover">
          </el-upload>

        </el-form-item>

        <el-form-item label="课程价格">
            <el-input-number :min="0" v-model="courseInfo.course.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
        </el-form-item>
    </el-form>

  </div>
</template>
<script>
import courseApi from '@/api/course'
import subjectApi from '@/api/subject'
import teacherApi from '@/api/teacher'

import Tinymce from '@/components/Tinymce'

let course = {
    title: '',
    subjectId: '',
    teacherId: '',
    cover: process.env.OSS_PATH + '/pic/defaultCourseImg2.jpg',
    lessonNum: 0,
    price: 0,
    subjectParentId: ''
}
let courseDescription = {
    description: '' 
}

export default {
  data() {
    return {
      OSS_PATH: process.env.OSS_PATH,
      BASE_API: process.env.BASE_API,
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo:{course,courseDescription},
      subjectNestedList: [], //课程分类的一级分类集合
      subSubjectList: [], //课程分类的二级分类集合
      teacherList: [],
      courseId: ''
      
    }
  },

  created() {
    console.log('info created')
    
    this.init()
  },

  methods: {
    handleAvatarSuccess(response, file){
      console.log(file)
      this.courseInfo.course.cover = response.data.url
    },

    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG||isPNG) && isLt2M
    },
    
    init(){
      if(this.$route.params&&this.$route.params.id){
        this.fetchCourseInfoById()
      }else{
        console.log('新建')
        //添加
        //置空
        // this.courseInfo={...course,...courseDescription}
        //加载课程分类信息
        this.initSubjectInfo()
        //加载讲师信息
        this.initTeacherInfo()
      }
    },

    fetchCourseInfoById(){
      //修改
      // this.courseId = this.$route.params.id
      // console.log('修改！courseId=' + this.courseId)
      console.log('修改！courseId=' + this.$route.params.id)
      //到数据库中根据courseId查询课程信息
      courseApi.getCourseById(this.$route.params.id)
      .then(response => {
        this.courseInfo = response.data.courseInfo
        //获取所有科目分类
        subjectApi.getSubjectList()
        .then(response => {
          this.subjectNestedList = response.data.items
          for (let i = 0; i < this.subjectNestedList.length; i++) {
            if (this.subjectNestedList[i].id === this.courseInfo.course.subjectParentId) {
              this.subSubjectList = this.subjectNestedList[i].children
            }
          }
        })

        this.initTeacherInfo()
      })
    },

    initTeacherInfo(){
      teacherApi.getTeacheList()
      .then(response => {
        this.teacherList = response.data.teacherList
      })
    },

    initSubjectInfo(){
      console.log('initSubjectInfo')
      subjectApi.getSubjectList()
      .then(response => {
        this.subjectNestedList = response.data.items
      })
    },

    subjectLevelOneChanged(value){
      console.log(value)
      this.subSubjectList = []
      for(let i = 0; i < this.subjectNestedList.length; i++){
        if(value === this.subjectNestedList[i].id){
          this.subSubjectList = this.subjectNestedList[i].children
          this.courseInfo.course.subjectId = '' 
        }
      }
    },

    next() {
      console.log('next')
      if(this.$route.params&&this.$route.params.id){
        //修改
        console.log(this.courseInfo)
        courseApi.update(this.$route.params.id,this.courseInfo)
        .then(response =>{
          console.log('success')
          if(response.success === true){
            console.log('success==true')
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            return response
          }else{
            this.$message({
              type: 'info',
              message: response.data.message
            })
          }
        })
        .then(response => {
          console.log('准备跳转')
          this.$router.push({ path: '/course/chapter/' + response.data.courseId })
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '修改失败!'
          })
        })
      }else{
        //新添
        courseApi.save(this.courseInfo)
        .then(response => {
              this.$message({
                  type: 'success',
                  message: '保存成功!'
              })
              return response
        })
        .then(response => {
              this.$router.push({ path: '/course/chapter/' + response.data.courseId })
        })
        .catch(response => {
              this.$message({
                  type: 'error',
                  message: response.message
              })
        })
      }
    }
  },

  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  components: {
    Tinymce
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>