import $api from "@/http";
import { Game, GameUser, Messages, Move } from "@/types";
import { AxiosResponse } from "axios";


export default class GameService {

  static async create(game: Game): Promise<AxiosResponse<Game>> {
    return $api.post<Game>('/games/', game)
  }

  static async update(game: Game) {
    return $api.put('/games/', game)
  }

  static async addUser(user: GameUser) {
    return $api.post('/games/add/', user)
  }

  static async setUser(user: { [key: string]: string | number | boolean | undefined }) {
    return $api.put('/games/setuser/', user)
  }
  static async killByMafia(id: number) {
    return $api.put('/games/kill/', { id })
  }
  static async border(id: number) {
    return $api.put('/games/border/', { id })
  }

  static async getById(id: number) {
    return $api.get(`/games/${id}`)
  }

  static async getAll() {
    return $api.get('/games/')
  }

  static async getByAdminId(id: number) {
    return $api.get(`/games/admin/${id}`)
  }

  static async getByUserId(id: number) {
    return $api.get(`/games/user/${id}`)
  }

  static async userMove(move: any) {
    return $api.post(`/games/move/`, move)
  }
  static async gameMoves(id: number, stage: number, round: number): Promise<AxiosResponse<Move[]>> {
    return $api.get<Move[]>(`/games/move/${id}/${stage}/${round}`)
  }
  static async nomination(user_id: number, game_id: number, game_round?: number): Promise<AxiosResponse> {
    return $api.post(`/games/nomination/`, { user_id, game_id, game_round })
  }
  static async nominationSelect(user_id: number, game_id: number, game_round: number): Promise<AxiosResponse> {
    return $api.post(`/games/nomination/select/`, { user_id, game_id, game_round })
  }
  static async allNominated(game_id: number, round: number): Promise<AxiosResponse> {
    return $api.get(`/games/nomination/${game_id}/${round}`)
  }
  static async selected(game_id: number, round: number): Promise<AxiosResponse> {
    return $api.get(`/games/selected/${game_id}/${round}`)
  }

  static async message(message: Messages): Promise<AxiosResponse> {
    return $api.post(`/games/message/`, message)
  }
  static async getMessages(id: number, round: number, time: string): Promise<AxiosResponse> {
    return $api.get(`/games/message/${id}/${round}/${time}`)
  }
}