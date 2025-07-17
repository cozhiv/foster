// /app/items/page.tsx
//'use client';
import { useEffect, useState } from 'react';
import { useItemsStore } from '@/lib/itemStore';
import { useWebSocketClient } from '@/utils/swClient';
//import { useSelector, useDispatch } from 'react-redux'

export default function ItemsPage() {
  const items = useItemsStore((state) => state.items);
  const [name, setName] = useState('');

  useWebSocketClient();

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => useItemsStore.getState().setItems(data));
  }, []);

  const addItem = async () => {
    await fetch('/api/items/create', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    setName('');
  };

  const deleteItem = async (id: string) => {
    await fetch('/api/items/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  };

  return (
    <div>
      <h1>Items</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={addItem}>Add Item</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
