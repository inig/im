/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88" . "88
 **                                                         (| -_- |)
 **                                                          O\ = /O
 **                                                      ____/`---'\____
 **                                                    .   ' \\| |// `.
 **                                                     / \\||| : |||// \
 **                                                   / _||||| -:- |||||- \
 **                                                     | | \\\ - /// | |
 **                                                   | \_| ''\---/'' | |
 **                                                    \ .-\__ `-` ___/-. /
 **                                                 ___`. .' /--.--\ `. . __
 **                                              ."" '< `.___\_<|>_/___.' >'"".
 **                                             | | : `- \`.;`\ _ /`;.`/ - ` : | |
 **                                               \ \ `-. \_ __\ /__ _/ .-` / /
 **                                       ======`-.____`-.___\_____/___.-`____.-'======
 **                                                          `=---='
 **
 **                                       .............................................
 **                                              佛祖保佑             永无BUG
 **                                      佛曰:
 **                                              写字楼里写字间，写字间里程序员；
 **                                              程序人员写程序，又拿程序换酒钱。
 **                                              酒醒只在网上坐，酒醉还来网下眠；
 **                                              酒醉酒醒日复日，网上网下年复年。
 **                                              但愿老死电脑间，不愿鞠躬老板前；
 **                                              奔驰宝马贵者趣，公交自行程序员。
 **                                              别人笑我忒疯癫，我笑自己命太贱；
 **                                              不见满街漂亮妹，哪个归得程序员？
 */
/**
 * Created by liangshan on 2017/5/16.
 */
import { showLoading, hideLoading } from './index'
const $ = require('jquery')

const noop = () => {}

export const xhr = (options = {}) => {
  showLoading()
  const success = options.success || noop
  const error = options.error || noop
  const url = (/^http/.test(options.url) ? options.url : `${STATE.requestUrl}${options.url}`)
  return new Promise((resolve, reject) => {
    $.ajax(Object.assign({
      type: 'GET'
    }, options, {
      url,
      dataType: 'jsonp',
      jsonp: 'callback',
      jsonpCallback: 'JsonCallback',
      success (res) {
        if (Number(res.StatusCode) === 200) {
          resolve(res)
          success(res)
        } else {
          success(res)
          reject(res)
          console.log('返回错误：', res.StatusDescription)
        }
      },
      error (err) {
        reject(err)
        error(err)
        console.log('请求失败：', err)
      },
      complete () {
        hideLoading()
      }
    }))
  })
}
