import { BaseApi } from '@/api/base'

export class ChatAPI extends BaseApi {
  chat(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/messages/${senderId}/${recipientId}`)
  }
}
