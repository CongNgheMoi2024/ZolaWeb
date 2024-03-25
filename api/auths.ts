import { BaseApi } from '@/api/base'

export class AuthAPI extends BaseApi {
  sendOTPForgetPassword(phoneNo: string): Promise<any> {
    return this.post('/forget-password', { phoneNo })
  }

  verifyOTPForgetPassword(data: any): Promise<any> {
    return this.put('/otp-forget/{phone}', { data })
  }

  register(data: any): Promise<any> {
    return this.post('/auth/register', data)
  }

  sendOTPRegister(phoneNo: string): Promise<any> {
    return this.post('/phoneNumber', { phoneNo })
  }

  verifyOTPRegister(otp: any): Promise<any> {
    return this.post('/otp', { otp })
  }
}
