// /app/items/page.tsx
//'use client';
import { useEffect } from 'react';
import { useItemsStore } from '../lib/itemsStore';
import { useWebSocketClient } from '@/utils/wsClient';

export default function ItemsPage() {
  const items = useItemsStore((state) => state.items);

  useWebSocketClient();

  useEffect(() => {
    // fetch initial items
    fetch('/api/items')
      .then(res => res.json())
      .then(data => useItemsStore.getState().setItems(data));
  }, []);

  return (
    <ul>
    {
      items.map((item) => (
        <li key= { item.id } >
        { item.name }
        < button onClick = {() => deleteItem(item.id)} > Delete </button>
    </li>
  ))
}
</ul>
  );
}
