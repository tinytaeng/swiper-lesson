exports.config =
  modules: ['autoprefixer','copy', 'server', 'jade', 'sass', 'coffeescript', 'stylus', 'live-reload', 'client-jade-static']
  watch:
    sourceDir: 'src'
    javascriptDir: '.'
    exclude: ['terminal.glue']
  template:
    wrapType: 'none'
    outputFileName: "js/templates"
  server:
    defaultServer:
      enabled: true
    views:
      path: 'src'
  clientJadeStatic:
    prettyOutput: true
  coffeescript:
    option:
      bare:true
