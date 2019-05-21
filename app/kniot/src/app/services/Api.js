import axios from 'axios'

var axiosInstance = axios.create({
    baseURL: "http://" + localStorage.getItem('ipServer') + ":3000/api"
})

export default axiosInstance
