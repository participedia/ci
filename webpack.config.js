var getConfig = require('hjs-webpack')
var webpack = require('webpack')

var config = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true
})

config.module.noParse = [/aws\-sdk/]

const dotenv = require('dotenv')
const dotEnvVars = dotenv.config()

const envVariables = Object.assign({}, dotEnvVars)

const defines =
  Object.keys(envVariables).reduce((memo, key) => {
    const val = JSON.stringify(envVariables[key])
    memo[`__${key.toUpperCase()}__`] = val
    return memo
  }, {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })

config.plugins.push(new webpack.DefinePlugin(defines))

module.exports = config
