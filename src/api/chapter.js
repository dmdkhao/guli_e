import request from '@/utils/request'

const path = '/admin/edu/chapter'
export default {
  getChapterAndVideo(courseId){
    return request({
        url: `${path}/getChapterAndVideo/${courseId}`,
        method: 'get'
    })
  },

  save(chapter){
    return request({
      url: `${path}/save`,
      method: 'post',
      data: chapter
    })
  },

  deleteById(id){
    return request({
      url: `${path}/${id}`,
      method: 'delete'
    })
  },

  update(chapter){
    return request({
      url: `${path}`,
      method: 'put',
      data: chapter
    })
  },

  getChapterById(id){
    return request({
      url: `${path}/${id}`,
      method: 'get'
    })
  }

  
}