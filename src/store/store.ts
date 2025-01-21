import UserService from "@/services/UserService";
import { Game, User } from "@/types";
import { makeAutoObservable } from "mobx";

export default class Store {
  user = {} as User;
  isAuth = false;
  game = {} as Game;


  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User) {
    this.user = user;
  }
  setGame(game: Game) {
    this.game = game
  }
  async checkAuth(userId: number, user: User) {
    try {
      const response = await UserService.getById(userId)

      if (response.data == null) {
        const create = await UserService.create(user)
        this.setUser(create.data)
      }
      else {
        this.setUser(response.data)

      }
    } catch (e) {
      console.log(e);
    }
  }
}

export const RootStore = {
  Store,
};
