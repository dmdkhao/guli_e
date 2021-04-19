import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/edu/teacher/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/edu/teacher/info',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/edu/teacher/logout',
    method: 'post'
  })
}
