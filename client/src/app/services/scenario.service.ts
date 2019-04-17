import Api from './Api'

export default {
  addScenario(params){
    return Api.post('/kniot/addScenario',params)
  },
  deleteScenario(params){
    return Api.get('/kniot/deleteScenario/'+params)
  },
  getAllScenario(){
    return Api.get('/kniot/findAllScenario')
  },
  
}
