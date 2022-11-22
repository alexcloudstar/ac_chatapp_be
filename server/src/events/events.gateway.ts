import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chat')
  async chat(@MessageBody() data: string): Promise<string> {
    console.log(data);
    return data;
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody() data: string): Promise<string> {
    console.log('typing');
    return data;
  }

  @SubscribeMessage('punish')
  async punish(@MessageBody() data: string): Promise<string> {
    return data;
  }
}
