import { extend } from 'umi-request';
import { notification } from 'ant-design-vue';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '接口不存在,请联系管理员',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

const errMsg = {
  '-1': '系统异常，请联系管理员',
  '10000000': '您未登录，请先登录',
  '10000001': '参数不合法',
  '10000002': '数据不存在',
  '10030001': '用户名或密码错误'
}

/**
 * 显示异常弹框
 * @param msg 
 */
const showError = (msg) => {
  notification.error({
    message: `请求失败`,
    description: msg,
  });
}

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  console.log(error);
  const { response } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  showError(errortext);
};

const request = extend({
  errorHandler,
});

/**
 * 请求拦截器
 * 向请求头中添加 token
 */
request.interceptors.request.use((url, options) => {
  let authorization = localStorage.getItem('token');
  authorization = authorization || "";
  return (
    {
      url,
      options: {...options, headers: {
        'authorization': authorization,
      }}
    }
  )
})

/**
 * 统一处理 业务异常
 */
request.interceptors.response.use(async (response) => {
  console.log('ajax',response);
  if (response.status != 200) {
    return response;
  }
  const data = await response.clone().json();
  if (!data.errCode) {
    return response;
  }
  if (data.errCode !== '1') {
    data.status = 'error';
    showError(errMsg[data.errCode]);
  } else {
    data.status = 'ok';
  }
  return response;
})



export default request;