import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";

export interface Stop {
  id: string;
  tripId: string;
  cityId: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  order: number;
}

export function useStops(tripId: string | null) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      setStops([]);
      setLoading(false);
      return;
    }

    const fetchStops = async () => {
      const q = query(
        collection(db, `trips/${tripId}/stops`),
        orderBy("order", "asc")
      );
      const snapshot = await getDocs(q);
      const stopsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stop));
      setStops(stopsData);
      setLoading(false);
    };

    fetchStops();
  }, [tripId]);

  const addStop = async (stop: Omit<Stop, "id">) => {
    const docRef = await addDoc(collection(db, `trips/${tripId}/stops`), stop);
    return docRef.id;
  };

  const updateStop = async (id: string, data: Partial<Stop>) => {
    await updateDoc(doc(db, `trips/${tripId}/stops`, id), data);
  };

  const deleteStop = async (id: string) => {
    await deleteDoc(doc(db, `trips/${tripId}/stops`, id));
  };

  return { stops, loading, addStop, updateStop, deleteStop };
}
