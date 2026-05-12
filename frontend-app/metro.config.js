const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const sharedRoot = path.resolve(projectRoot, '../shared')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [sharedRoot]
config.resolver.extraNodeModules = {
  'petappoint-shared': path.resolve(sharedRoot, 'src'),
}

module.exports = withNativeWind(config, { input: './global.css' })
