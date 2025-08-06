import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import BankCard from "../components/Bankcard";
import AddBankModal from "../components/AddBankModal";
import { useAuth } from "@clerk/clerk-react";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const { user } = useUser();
  const [banks, setBanks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBank, setEditBank] = useState(null);


const fetchBanks = async () => {
  try {
    const token = await getToken();

    const res = await axios.get(`${backendUrl}/api/banks/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBanks(res.data);
    console.log("✅ Banks:", res.data);
  } catch (err) {
    console.error("❌ Error fetching banks:", err);
  }
};
const { getToken } = useAuth();
const handleSave = async (newBankData) => {
  try {
    const token = await getToken();

    if (editBank) {
      // Update existing bank
      await axios.put(`${backendUrl}/api/banks/${editBank._id}`, newBankData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Bank updated");
    } else {
      // Add new bank
      await axios.post(`${backendUrl}/api/banks`, newBankData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Bank added");
    }

    setModalOpen(false);
    setEditBank(null);
    fetchBanks(); // Refresh the banks list
  } catch (err) {
    console.error("❌ Error saving bank: ", err);
  }
};


  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      
      await axios.delete(`${backendUrl}/api/banks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBanks();
    } catch (error) {
      console.error("Error deleting bank:", error);
    }
  };

  useEffect(() => {
    const syncUserToDB = async () => {
      if (user?.id) {
        await axios.post(`${backendUrl}/api/users/sync`, {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username || user.firstName || "Unknown",
        });
        fetchBanks();
      }
    };
    syncUserToDB();
  }, [user]);

  return (
    <div className="container">
      <div className="header">
        <h2>My Bank Accounts</h2>
        <button className="btn" onClick={() => { setEditBank(null); setModalOpen(true); }}>
          + Add Bank
        </button>
      </div>

      {banks.length === 0 ? (
        <div className="no-data">
          <p>No bank accounts found. Click "Add Bank" to get started.</p>
        </div>
      ) : (
        <div className="bank-list">
          {banks.map((bank) => (
            <BankCard
              key={bank._id}
              bank={bank}
              onEdit={() => { setEditBank(bank); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <AddBankModal
          bank={editBank}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
