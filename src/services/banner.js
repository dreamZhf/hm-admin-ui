import request from '@/common/ajax'

/**
 * banner 列表
 */
export async function list() {
  return request.get('/api/banner/list.json')
}

/**
 * banner 详情
 * @param {*} param 
 */
export async function detail(param) {
  return request.get('/api/banner/detail.json', {
    params: param
  })
}

/**
 * 添加 banner 详情
 * @param {*} param 
 */
export async function addBannerImage(param) {
  return request.post('/api/banner/addBannerImage.json', {
    data: param
  })
}

/**
 * 删除 banner 图片
 * @param {*} params 
 */
export async function deleteBannerImage(params) {
  return request.get('/api/banner/deleteBannerImage.json', {
    params
  })
}

/**
 * 编辑 banner 图片
 * @param {*} param 
 */
export async function editBannerImage(param) {
  return request.post('/api/banner/editBannerImage.json', {
    data: param
  })
}