module.exports = {
  /**
   * 系统名称
   */
  systemName: '宁波银行速汇盈',

  /**
   * 系统登录页名称
   */
  systemNameLoginPage: '速汇盈demo系统',

  /**true
   * header_key header中的token 的key值
   */
  header_key: "X-Access-Token",


  /**
   * 登录时的验证码开关
   */
  validatedCodeSwitch: false,


  /**
   * axios超时时间配置.默认为30秒钟
   */
  requestTimeout: 30000,

  /**
   * 是否不展示(隐藏)引导页，true为不展示，false为展示
   */
  hiddenGuidePage: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'

}
