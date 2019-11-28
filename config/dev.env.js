'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.18.200:8080/"'
  // BASE_API: '"http://192.168.18.200:8080/"'
  // BASE_API: '"http://qxiao.natapp1.cc/"'
  //BASE_API: '"http://192.168.0.106:8080/"'
  // BASE_API: '"http://qxiaonmq.natapp1.cc/"'
  BASE_API: '"http://letsgorocket.nat300.top/"'
});
