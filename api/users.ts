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

  getFriendByName(id: string, name: string): Promise<any> {
    return this.get(`/users/${id}/friends/${name}`)
  }

  sendOTPForgetPassword(phone: string): Promise<any> {
    return this.post('/forget-password', { phone })
  }

  verifyOTP(phone: string, otp: string, password: string): Promise<any> {
    return this.put('/otp-forget/{phone}', { phone, otp, password })
  }
}
