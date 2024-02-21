import { BaseApi } from '@/api/base'

export class UserAPI extends BaseApi {
  getUsers(params: any): Promise<any> {
    return this.get('/users', { params })
  }

  user(id: string): Promise<any> {
    return this.get(`/users/${id}`)
  }

  getUserByPhone(phone: string): Promise<any> {
    return this.get(`/users/${phone}`)
  }

  addFriend(id: string, friendId: string): Promise<any> {
    return this.post(`/users/${id}/add-friend/${friendId}`)
  }
}
