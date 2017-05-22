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

export const getPlatformType = () => {
  /***
   * ios: 1; android: 2; windows: 3; mac: 4; 其它: -1
   * @type {number}
   * @private
   */
  let _type = -1
  let _platformStr = navigator.platform.toLowerCase()
  let _userAgentStr = navigator.userAgent.toLowerCase()
  if (_platformStr === 'win32' || _platformStr === 'windows') {
    // Windows
    _type = 3
  } else if (_platformStr === 'mac68k' || _platformStr === 'macppc' || _platformStr === 'macintosh' || _platformStr === 'macintel') {
    // Mac
    _type = 4
  } else if (_userAgentStr.indexOf('android') > 0) {
    // Android
    _type = 2
  } else if (_userAgentStr.indexOf('iphone') > 0 || _userAgentStr.indexOf('ipad') > 0 || _userAgentStr.indexOf('ipod') > 0) {
    // IOS
    _type = 1
  } else {
  }
  return _type
}
