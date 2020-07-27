import request from '@/common/ajax'

/**
 * 登录
 * @param {*} param 
 */
export async function login(param) {
  return request.post('/api/user/login.json', {
    data: param
  })
}