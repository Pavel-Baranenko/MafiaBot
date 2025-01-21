import $api from "@/http";
import { gameFinance } from "@/types";
import { AxiosResponse } from "axios";


export default class StatsService {

  static async create(stats: gameFinance) {
    return $api.post('/finance/', stats)
  }

  static async update(stats: gameFinance) {
    return $api.put('/finance/', stats)
  }

  static async getById(id: number): Promise<AxiosResponse<gameFinance>> {
    return $api.get<gameFinance>(`/finance/${id}`)
  }

}