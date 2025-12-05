'use client'; // Required for client-side data fetching

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from '@/app/lib/firebase'; // ⚠️ Check this path matches your firebase setup

// --- Interface for the data coming from Firestore ---
// interface BulkBuyData {
//   id: string;
//   item: string;
//   status: "Active" | "Pending";
//   details: string;
//   membersPaid: number;
//   totalMembers: number;
// }

interface BulkBuyData {
  id: string;
  itemName: string;
  quantitiy: number;
  targetPrice: number;
}

// --- PurchaseCard Component (Unchanged UI) ---
// interface PurchaseCardProps {
//   item: string
//   status: "Active" | "Pending"
//   details: string
//   membersPaid: number
//   totalMembers: number
// }

interface PurchaseCardProps {
  id: string;
  itemName: string;
  quantitiy: number;
  targetPrice: number;
}

function PurchaseCard({ id, itemName, quantitiy, targetPrice }: PurchaseCardProps) {
  // Prevent division by zero
  // const percentage = totalMembers > 0 ? Math.round((membersPaid / totalMembers) * 100) : 0;
  const statusColor = status === "Active" ? "bg-green-100 text-[#22A65B]" : "bg-gray-100 text-gray-600"

  return (
    <Card className="p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{itemName}</h3>
          <p className="text-sm text-gray-600 mt-1">{quantitiy}</p>
        </div>
        <Badge className={`${statusColor} border-0`}>{status}</Badge>
      </div>

      {/* <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {membersPaid}/{totalMembers} members paid
          </span>
          <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#22A65B] h-2 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
        </div>
      </div> */}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 bg-transparent">
          View Details
        </Button>
        <Button className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] text-white">Track Payments</Button>
      </div>
    </Card>
  )
}

// --- ActivePurchases Component (Updated with Logic) ---
export function ActivePurchases() {
  const [purchases, setPurchases] = useState<BulkBuyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        // Fetch items that are NOT completed (Active or Pending)
        const q = query(collection(db, "requests")); 
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data);

          // 1. Calculate Days Remaining
          const today = new Date();
          // specific check to handle Firestore Timestamp vs regular Date
          const closing = data.closingDate?.toDate ? data.closingDate.toDate() : new Date(data.closingDate || today);
          const diffTime = closing.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // 2. Logic for the status text
          let timeText = "";
          if (data.status === "Pending") {
            timeText = "Waiting for others";
          } else {
             timeText = daysLeft > 0 ? `Closes in ${daysLeft} days` : "Closing soon";
          }

          // 3. Construct the Details String
          // Example result: "100 bags committed • ₦36,000/bag • Closes in 3 days"
          // const detailsString = `${data.committed} ${data.unit || 'units'} committed • ₦${Number(data.price).toLocaleString()}/${data.unitType || 'unit'} • ${timeText}`;

          return {
            id: doc.id,
            item: data.itemName,           
            quantitiy: data.quantity || 0,       
            targetPrice: data.targetPrice || 0,
          } as BulkBuyData;
        });

        setPurchases(items);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Active Purchases</h2>
        <a href="#" className="text-[#22A65B] hover:text-[#1B8A4A] font-medium flex items-center gap-1">
          View All <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          // Simple loading skeleton or text
          <div className="col-span-1 lg:col-span-2 text-center py-10 text-gray-500">
            Loading active purchases...
          </div>
        ) : purchases.length > 0 ? (
          purchases.map((buy) => (
            <PurchaseCard
              id={buy.id}
              itemName={buy.itemName}
              quantitiy={buy.quantitiy}
              targetPrice={buy.targetPrice}
            />  ))
        ) : (
          <div className="col-span-1 lg:col-span-2 text-center py-10 text-gray-500">
            No active bulk purchases found.
          </div>
        )}
      </div>
    </div>
  )
}