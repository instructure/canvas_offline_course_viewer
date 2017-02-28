import appInfo from '../../package.json'

export const versionString = appInfo.version
export const versionArray = versionString.split('.').map(v => parseInt(v))
