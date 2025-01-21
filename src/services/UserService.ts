import $api from "@/http";
import { User } from "@/types";


export default class UserService {

  static async create(user: User) {
    return $api.post('/users/', user)
  }

  static async update(user: User) {
    return $api.put('/users/', user)
  }

  static async getById(id: number) {
    return $api.get(`/users/${id}`)
  }

  static async getAll() {
    return $api.get('/users/')
  }

  static async getRating() {
    return $api.get('/users/rating/')
  }

  static async sendImg(img: FormData) {
    return $api.post('/users/image/', img)
  }

}