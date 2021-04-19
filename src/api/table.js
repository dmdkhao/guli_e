import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/edu/teacher/table/list',
    method: 'get',
    params
  })
}
