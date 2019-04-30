import Api from './Api'

export default {

  addConfig(params){
    return Api.post('/kniot/addKnxConfig',params)
  },
  updateConfig(params){
    return Api.post('/kniot/updateKnxConfig',params)
  },
  deleteConfig(params){
    return Api.get('/kniot/deleteKnxConfig/'+params)
  },
  findConfigs(){
    return Api.get('/kniot/findKNXConfigs')
  },
  connect (param) {
    return Api.get('/kniot/connect/'+param)
  },
  disconnect (param) {
    return Api.get('/kniot/disconnect/'+param)
  },
  startAllLights (param) {
    return Api.get('/kniot/startAllLights/'+param)
  },
  stopAllLights (param) {
    return Api.get('/kniot/stopAllLights/'+param)
  },
  startLight (param) {
    return Api.post('/kniot/startLight',param)
  },
  stopLight (param) {
    return Api.post('/kniot/stopLight',param)
  },
  startChase (param) {
    return Api.get('/kniot/startChase/'+param)
  },
  stopChase (param) {
    return Api.get('/kniot/stopChase/'+param)
  },
  intervalValue(param){
    return Api.post('/kniot/interval',param)
  },
  reverse (param){
    return Api.get('/kniot/reverse/',param)
  },
  getAllLight(param){
    return Api.get('kniot/allLight/'+param)
  },
  addLight(param){
    return Api.post('kniot/addLight' , param)
  },
  removeLight(param){
    return Api.post('kniot/removeLight' , param)
  }
}
