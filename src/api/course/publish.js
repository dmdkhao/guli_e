import request from '@/utils/request'

const path = '/admin/edu/course'
export default {
  getPublishInfo(id){
    return request({
      url: `${path}/getPublishInfo/${id}`,
      method: 'get'
    })
  },

  publish(id){
    return request({
      url: `${path}/publish/${id}`,
      method: 'get'
    })
  }
}