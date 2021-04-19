import request from '@/utils/request'

const path = '/admin/edu/teacher'
export default{

    getTeacherPage(page,size,teacher) {
        return request({
          url: `${path}/${page}/${size}`,
          method: 'post',
          data: teacher
        })
    },
    deleteTeacherById(id){
        return request({
            url: `${path}/${id}`,
            method: 'delete'
        })
    },
    save(teacher){
        return request({
            url: `${path}`,
            method: 'post',
            data: teacher
        })
    },
    update(id,teacher){
        return request({
            url: `${path}/${id}`,
            method: 'put',
            data: teacher
        })
    },
    
    getTeacherById(id){
        return request({
            url: `${path}/${id}`,
            method: 'get',
        })
    },

    getTeacheList(){
        return request({
            url: `${path}/list`,
            method: 'get'
        })
    }
}