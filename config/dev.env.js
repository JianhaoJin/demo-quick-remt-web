module.exports = {
  //NODE只有两个选项：development(开发环境) 和 production(生产环境)
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  //静态文件相对路径，需要和nginx配置一致
  ASSETS_PUBLIC_PATH: '/',
  //代理后端访问地址的根路径，需要和nginx配置一致
  //BASE_API: '"/demo-quick-remt-web"',
  BASE_API: '"/demo-quick-remt-web"',
}

