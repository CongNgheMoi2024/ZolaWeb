import { AxiosInstance } from 'axios'
import { UserAPI } from '@/api/users'
import { ChatAPI } from '@/api/chats'

export class Api<T extends unknown> {
  public readonly users: UserAPI
  public readonly chats: ChatAPI

  constructor(axios: AxiosInstance) {
    this.users = new UserAPI(axios)
    this.chats = new ChatAPI(axios)
  }
}
