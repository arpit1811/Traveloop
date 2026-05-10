import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";

export interface PackingItem {
  id: string;
  tripId: string;
  name: string;
  category: string;
  isPacked: boolean;
}

export function usePacking(tripId: string | null) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      setItems([]);
      setLoading(false);
      return;
    }

    const fetchItems = async () => {
      const q = query(collection(db, `trips/${tripId}/packing`), orderBy("category", "asc"));
      const snapshot = await getDocs(q);
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PackingItem));
      setItems(itemsData);
      setLoading(false);
    };

    fetchItems();
  }, [tripId]);

  const addItem = async (item: Omit<PackingItem, "id">) => {
    const docRef = await addDoc(collection(db, `trips/${tripId}/packing`), item);
    return docRef.id;
  };

  const togglePacked = async (id: string, isPacked: boolean) => {
    await updateDoc(doc(db, `trips/${tripId}/packing`, id), { isPacked });
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, `trips/${tripId}/packing`, id));
  };

  return { items, loading, addItem, togglePacked, deleteItem };
}
