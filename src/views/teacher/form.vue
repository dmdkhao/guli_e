<template>
<div>
    <div class="app-container">
        <el-form label-width="120px">
        <el-form-item label="讲师名称">
            <el-input v-model="teacher.name"/>
        </el-form-item>
        <el-form-item label="讲师排序">
            <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="讲师头衔">
            <el-select v-model="teacher.level" clearable placeholder="请选择">
            <!--
                数据类型一定要和取出的json中的一致，否则没法回填
                因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
            </el-select>
        </el-form-item>
        <el-form-item label="讲师资历">
            <el-input v-model="teacher.career"/>
        </el-form-item>
        <el-form-item label="讲师简介">
            <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
        </el-form-item>

        <!-- 讲师头像：TODO -->
        <!-- 讲师头像 -->
        <el-form-item label="讲师头像">

            <!-- 头衔缩略图 -->
            <pan-thumb :image="teacher.avatar"/>
            <!-- 文件上传按钮 -->
            <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
            </el-button>

            <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
            <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduservice/oss/upload'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>

        </el-form-item>



        <el-form-item>
            <el-button type="primary" @click="saveOrUpdate()">保存</el-button>
        </el-form-item>
        </el-form>
    </div>
</div>

</template>

<script>
import teacherApi from '@/api/teacher'

import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

let defaultForm = {
                name: '',
                sort: 1,
                level: 1,
                career: '',
                intro: '',
                avatar: ''
            }
export default {
    data(){
        return {
            teacher: defaultForm,
            BASE_API: process.env.BASE_API,
            imagecropperShow: false,
            imagecropperKey: 0
        }
    },
    created(){
        this.init()
    },
    methods: {
        init(){
            if(this.$route.params && this.$route.params.id){
                console.log("做修改操作")
                //做修改操作
                let id = this.$route.params.id;
                //根据id查询teacher
                this.selectTeacherById(id)
            }else{
                this.teacher = {...defaultForm}
            }
        },

        saveOrUpdate(){
            console.log("id="+this.teacher.id)
            if(!this.teacher.id){
                console.log('做保存')
                //保存
                this.saveTeacher()
            }else{
                console.log('做修改')
                //修改
                this.updateTeacher()
            }
        },
        saveTeacher(){
            console.log(this.teacher)
            teacherApi.save(this.teacher)
            .then(()=>{
                return this.$message({
                    type: 'success',
                    message: '添加成功!'
                })
            })
            .then(()=>{
                //跳转到讲师列表
                this.$router.push({path: '/teacher'})
            })
            .catch(()=>{
                this.$message({
                    type: 'error',
                    message: '添加失败!'
                })
            })
        },
        updateTeacher(){
            teacherApi.update(this.teacher.id,this.teacher)
            .then((response)=>{
                console.log('修改成功')
                return this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
            })
            .then(()=>{
                console.log('修改成功，准备跳转')
                this.$router.push({path: '/teacher'})
            })
            .catch(()=>{
                this.$message({
                    type: 'error',
                    message: '修改失败'
                })
            })
        },

        selectTeacherById(id){
            teacherApi.getTeacherById(id)
            .then((response)=>{
                this.teacher = response.data.item;
            })
            .catch(()=>{
                this.$message({
                    type: 'error',
                    message: '获取讲师信息失败!'
                })
            })
        },
        close(){
            this.imagecropperShow = false
            this.imagecropperKey = this.imagecropperKey + 1

        },
        cropSuccess(data){
            console.log(data)
            this.imagecropperShow = false
            this.imagecropperKey = this.imagecropperKey + 1
            this.teacher.avatar = data.url

        }
    },
    components: {
        ImageCropper,
        PanThumb
    },
    watch: {
        $route(to, from) {
        console.log('watch $route')
        this.init()
        }
    }
}
</script>

<style>

</style>