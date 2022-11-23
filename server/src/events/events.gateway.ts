import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    client.broadcast.emit('chat', data);

    return data;
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    console.log(data);
    client.broadcast.emit('typing', data);

    return data;
  }

  @SubscribeMessage('punish')
  async punish(@MessageBody() data: string): Promise<string> {
    return data;
  }
}
