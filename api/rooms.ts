import { BaseApi } from '@/api/base'

export class RoomAPI extends BaseApi {
  getRooms(params: any): Promise<any> {
    return this.get('/rooms', { params })
  }

  room(id: string): Promise<any> {
    return this.get(`/rooms/${id}`)
  }

  addRoom(data: any): Promise<any> {
    return this.post('/rooms', data)
  }

  addRoomMember(roomId: string, memberId: string): Promise<any> {
    return this.post(`/rooms/${roomId}/add-member/${memberId}`)
  }

  getRoomByUser(userId: string): Promise<any> {
    return this.get(`/rooms/user/${userId}`)
  }

  createRoomGroup(data: any): Promise<any> {
    return this.post('/rooms/create-room-group', data)
  }
}
