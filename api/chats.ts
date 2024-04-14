import { BaseApi } from '@/api/base'

export class ChatAPI extends BaseApi {
  chat(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/messages/${senderId}/${recipientId}`)
  }

  chatGroup(senderId: string,groupId: string): Promise<any> {
    return this.get(`/group-messages/${senderId}/${groupId}`)
  }

  sendFileMessage(data: any): Promise<any> {
    return this.post('/send-file-message', data)
  }

  forwardMessage(messageId: string, data: any): Promise<any> {
    return this.post(`/forward-messages/${messageId}`, data)
  }

  forwardMessageGroup(messageId: string, data: any): Promise<any> {
    return this.post(`forward-messages-group/${messageId}`, data)
  }

  getImagesAndVideos(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/image-video-messages/${senderId}/${recipientId}`)
  }

  getFiles(senderId: string, recipientId: string): Promise<any> {
    return this.get(`/file-messages/${senderId}/${recipientId}`)
  }

  deleteMessage(messageId: string): Promise<any> {
    return this.put(`/delete-messages/${messageId}`)
  }
}
