import request from '@/utils/request'

const path = '/admin/edu/subject'
export default{

    getSubjectList(){
        return request({
            url: `${path}`,
            method:'get'
        })
    },

    deleteSubjectById(id){
        return request({
            url: `${path}/${id}`,
            method: 'delete'
        })
    },

    saveLevelOne(subject){
        return request({
            url: `${path}/save-level-one`,
            method: 'post',
            data: subject
        })
    },

    saveLevelTwo(subject){
        return request({
            url: `${path}/save-level-two`,
            method: 'post',
            data: subject
        })
    }
}