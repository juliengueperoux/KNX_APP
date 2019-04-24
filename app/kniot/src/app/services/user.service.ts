import Api from './Api'

export default {
  fetchUsers () {
    return Api.get('/users')
  },

  fetchUsersAdministration () {
    return Api.get('/users/administration')
  },

  fetchOneUserAdmin (id) {
    return Api.get('/user/' + id)
  },

  fetchOneUser () {
    return Api.get('/user')
  },

  deleteUser() {
    return Api.get('/user/delete')
  },

  deleteUserAdmin (id) {
    return Api.get('/user/delete/' + id)
  },

  updateUserAdmin (params) {
    return Api.post('/user/update/' + params.id, params)
  },

  updateUser (params) {
    return Api.post('/user/update/', params)
  },

  createUser (params) {
    return Api.post('/user/create', params)
  },

  findIfExistUser(params){
    return Api.get('/user/findifexist',params)
  },

  getMyFutureReservations(){
    return Api.get('/user/getmyfuturereservations')
  },
  
  getMyReservations(){
    return Api.get('/user/getmyreservations')
  },

  getMyFutureReservation(){
    return Api.get('/user/myfuturereservation')
  },

  sendMailResetPassword(params){
    return Api.post('/user/resetPassword',params)
  },

  newPassword(params){
    return Api.post('/user/newPassword',params)
  },
  register(params){
    return Api.post('/user/register', params)
  },
  validUser(params){
    return Api.get('/user/validUser/' + params)
  }
}
