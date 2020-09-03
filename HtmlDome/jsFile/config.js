const setting = window.setting || {}
const { clientConfig } = setting

const isDev = /^(192\.168|localhost)/.test(window.location.host)
if (!isDev) {
  console.log = () => {}
  console.info = () => {}
  console.warn = () => {}
}

export default {
  ...clientConfig
}
