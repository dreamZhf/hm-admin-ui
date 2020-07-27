import request from '@/common/ajax'

/**
 * 项目列表
 * @param {*} param 
 */
export async function list(param) {
  return request.post('/api/project/list.json', {
    data: param
  })
}

/**
 * 项目详情
 * @param {*}} param 
 */
export async function detail(param) {
  return request.get(`/api/project/detail.json`, {
    params: param
  })
}

/**
 * 审核详情
 * @param params 
 */
export async function examineDetail(param) {
  return request.get(`/api/project/examineDetail.json`, {
    params: param
  })
}

/**
 * 根据项目ID获取会员信息
 * @param params 
 */
export async function memberInfoByProjectId(param) {
  return request.get(`/api/member/memberInfo.json`, {
    params: param
  })
}

/**
 * 审核通过
 * @param params 
 */
export async function examineAdopt(params) {
  return request.post('/api/project/adopt.json', {
    data: params
  })
}

/**
 * 审核不通过
 * @param params 
 */
export async function examineFail(params) {
  return request.post('/api/project/fail.json', {
    data: params
  })
}