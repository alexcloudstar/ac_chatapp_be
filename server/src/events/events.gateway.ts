import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatType, TypingType } from './types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chat')
  async chat(
    @MessageBody() data: ChatType,
    @ConnectedSocket() client: Socket,
  ): Promise<ChatType> {
    client.broadcast.emit('chat', data);

    return data;
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() data: TypingType,
    @ConnectedSocket() client: Socket,
  ): Promise<TypingType> {
    client.broadcast.emit('typing', data);

    return data;
  }

  @SubscribeMessage('punish')
  async punish(@MessageBody() data: string): Promise<string> {
    return data;
  }
}
