import { BaseApi } from '@/api/base'

export class UserAPI extends BaseApi {
  getUsers(params: any): Promise<any> {
    return this.get('/users', { params })
  }

  user(id: string): Promise<any> {
    return this.get(`/users/${id}`)
  }
}
