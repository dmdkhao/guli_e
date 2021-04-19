import request from '@/utils/request'

const path = '/admin/edu/video'
export default {

  saveVideo(videoInfo){
    return request({
      url: `${path}/saveVideo`,
      method: 'post',
      data: videoInfo
    })
  },

  updateVideo(videoInfo){
    return request({
      url: `${path}`,
      method: 'put',
      data: videoInfo
    })
  },

  getVideo(id){
    return request({
      url: `${path}/${id}`,
      method: 'get'
    })
  },

  deleteById(id){
    return request({
      url: `${path}/${id}`,
      method: 'delete'
    })
  }

}