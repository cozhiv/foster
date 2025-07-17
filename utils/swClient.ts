import { useEffect } from 'react';
import { useItemsStore } from '@/lib/itemStore';

export function useWebSocketClient() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === 'delete') {
        useItemsStore.getState().removeItem(payload.id);
      }
      if (type === 'create') {
        useItemsStore.getState().addItem(payload);
      }
    };

    return () => ws.close();
  }, []);
}
