"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function TestPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "requests"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(list);
    }

    load();
  }, []);

  return (
    <div>
      <h1>Your Firestore Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
