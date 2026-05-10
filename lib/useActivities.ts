import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";

export interface Activity {
  id: string;
  tripId: string;
  stopId: string;
  name: string;
  type: string;
  description?: string;
  cost: number;
  duration: number;
  date: string;
  time?: string;
}

export function useActivities(tripId: string | null) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      const q = query(
        collection(db, `trips/${tripId}/activities`),
        orderBy("date", "asc")
      );
      const snapshot = await getDocs(q);
      const activitiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
      setActivities(activitiesData);
      setLoading(false);
    };

    fetchActivities();
  }, [tripId]);

  const addActivity = async (activity: Omit<Activity, "id">) => {
    const docRef = await addDoc(collection(db, `trips/${tripId}/activities`), activity);
    return docRef.id;
  };

  const updateActivity = async (id: string, data: Partial<Activity>) => {
    await updateDoc(doc(db, `trips/${tripId}/activities`, id), data);
  };

  const deleteActivity = async (id: string) => {
    await deleteDoc(doc(db, `trips/${tripId}/activities`, id));
  };

  return { activities, loading, addActivity, updateActivity, deleteActivity };
}
