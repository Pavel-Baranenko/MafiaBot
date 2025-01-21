import axios from "axios";


// export const API_URL = "http://localhost:5000/api"
// export const API_URL = "http://localhost:5000/api"
// export const STATIC = "http://localhost:5000/"
// export const STATIC = "http://localhost:5000/"

export const API_URL = "https://api.pavel-barko.ru/api"
export const STATIC = "https://api.pavel-barko.ru/"

const $api = axios.create({
  baseURL: API_URL,
})


export default $api;