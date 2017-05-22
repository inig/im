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

// 强制更新session视图
export const UPDATE_SESSION = 'UPDATE_SESSION'

// 强制更新chat视图
export const UPDATE_CHAT = 'UPDATE_CHAT'
export const UPDATE_CHAT_VIEW = 'UPDATE_CHAT_VIEW'

export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'

export const INCREMENT_COUNT = 'INCREMENT_COUNT'
export const DECREMENT_COUNT = 'DECREMENT_COUNT'
export const ADD_MESSAGE = 'ADD_MESSAGE'

export const INIT_SESSIONS = 'INIT_SESSIONS'
export const INIT_SESSION_MEMBERS = 'INIT_SESSION_MEMBERS'
export const SET_CURRENT_SESSION = 'SET_CURRENT_SESSION'
export const RESET_CURRENT_SESSION = 'RESET_CURRENT_SESSION'
export const SET_CURRENT_SESSION_INFO = 'SET_CURRENT_SESSION_INFO'
export const INIT_PERSON_INFO = 'INIT_PERSON_INFO'

// 新增会话
export const ADD_SESSION = 'ADD_SESSION'

// 删除会话
export const REMOVE_SESSION = 'REMOVE_SESSION'

// 接收到新消息
export const RECEIVED_NEW_MESSAGE = 'RECEIVED_NEW_MESSAGE'

// 初始化所有会话未读消息数量
export const INIT_ALL_UNREAD_COUNT = 'INIT_ALL_UNREAD_COUNT'

// 清空会话未读数量
export const CLEAR_UNREAD_COUNT = 'CLEAR_UNREAD_COUNT'

// 缓存会话消息
export const INIT_LOCAL_MESSAGES = 'INIT_LOCAL_MESSAGES'

// 发送消息
export const SEND_MESSAGE = 'SEND_MESSAGE'

// 发送消息成功
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS'

// 更新消息
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE'

// 聊天内容滚动到最后
export const DO_SCROLL = 'DO_SCROLL'

// Socketio
export const SOCKET_CONNECT = 'SOCKET_CONNECT'
export const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT'
export const SOCKET_RESPONSE = 'SOCKET_RESPONSE'

export const SOCKET_GET_CONVERSATION_LIST = 'SOCKET_GET_CONVERSATION_LIST'
