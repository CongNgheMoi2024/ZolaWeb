import { BaseApi } from '@/api/base'

export class ChatAPI extends BaseApi {
  chat(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/messages/${senderId}/${recipientId}`)
  }

  sendFileMessage(data: any): Promise<any> {
    return this.post('/send-file-message', data)
  }

  forwardMessage(recipientId: string, data: any): Promise<any> {
    return this.post(`/forward-messages/${recipientId}`, data)
  }
}
