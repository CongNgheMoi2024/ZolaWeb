import { AxiosInstance } from 'axios'
import { UserAPI } from '@/api/users'
import { ChatAPI } from '@/api/chats'
import { RoomAPI } from '@/api/rooms'

export class Api<T extends unknown> {
  public readonly users: UserAPI
  public readonly chats: ChatAPI
  public readonly rooms: RoomAPI

  constructor(axios: AxiosInstance) {
    this.users = new UserAPI(axios)
    this.chats = new ChatAPI(axios)
    this.rooms = new RoomAPI(axios)
  }
}
