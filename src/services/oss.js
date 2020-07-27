import request from '@/common/ajax'

export async function getPolicy() {
  return request.get('/oss/', {
    params: {
      dirName: 'banner'
    }
  })
}