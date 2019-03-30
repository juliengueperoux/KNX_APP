import Api from './Api'

export default {

  addConfig(params){
    return Api.post('/kniot/addKnxConfig',params)
  },
  deleteConfig(params){
    return Api.post('/kniot/deleteKnxConfig',params)
  },
  findMyConfigs(params){
    return Api.get('/kniot/fingMyKNXConfigs')
  },
  connect () {
    return Api.get('/kniot/connect')
  },
  disconnect () {
    return Api.get('/kniot/disconnect')
  },
  startAllLights () {
    return Api.get('/kniot/startAllLights')
  },
  stopAllLights () {
    return Api.get('/kniot/stopAllLights')
  },
  startLight (param) {
    return Api.get('/kniot/startLight/'+param)
  },
  stopLight (param) {
    return Api.get('/kniot/stopLight/'+param)
  },
  startChase () {
    return Api.get('/kniot/startChase')
  },
  stopChase () {
    return Api.get('/kniot/stopChase')
  },
  intervalValue(param){
    return Api.get('/kniot/interval/'+param)
  },
  intervalUp (){
    return Api.get('/kniot/interval/up')
  },
  intervalDown (){
    return Api.get('/kniot/interval/down')
  },
  reverse (){
    return Api.get('/kniot/reverse')
  },
  getAllLight(){
    return Api.get('kniot/allLight/')
  },
  addLight(param){
    return Api.get('kniot/addLight/' + param)
  },
  removeLight(param){
    return Api.get('kniot/removeLight/' + param)
  }
}
