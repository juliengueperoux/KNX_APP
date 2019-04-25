import axios from 'axios'

var axiosInstance = axios.create({
baseURL: "http://" +"localhost"+ ":3000/api"
})

export default axiosInstance
