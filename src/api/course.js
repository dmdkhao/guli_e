import request from '@/utils/request'

const path = '/admin/edu/course'
export default {

    save(course){
        return request({
            url: `${path}/save`,
            method: 'post',
            data: course
        })
    },

    getCourseById(courseId){
        return request({
            url: `${path}/${courseId}`,
            method: 'get',
        })
    },

    update(courseId,courseInfo){
        return request({
            url: `${path}/${courseId}`,
            method: 'put',
            data: courseInfo
        })

    },

    getCourseList(page,limit,searchObj){
        return request({
            url: `${path}/${page}/${limit}`,
            method: 'post',
            data: searchObj
        })
    },

    deleteCourseById(id){
        return request({
            url: `${path}/${id}`,
            method: 'delete'
        })
    }
}