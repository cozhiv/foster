import next from 'next';
import { server as wsServer } from '../server';

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  wsServer.on('request', handle);
  wsServer.listen(3001, () => {
    console.log('WebSocket server running on ws://localhost:3001');
  });
});
