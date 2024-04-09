import { BaseApi } from '@/api/base'

export class ChatAPI extends BaseApi {
  chat(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/messages/${senderId}/${recipientId}`)
  }

  sendFileMessage(data: any): Promise<any> {
    return this.post('/send-file-message', data)
  }

  forwardMessage(messageId: string, data: any): Promise<any> {
    return this.post(`/forward-messages/${messageId}`, data)
  }

  getImagesAndVideos(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/image-video-messages/${senderId}/${recipientId}`)
  }

  getFiles(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/file-messages/${senderId}/${recipientId}`)
  }
}
