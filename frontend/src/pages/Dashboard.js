import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import BankCard from "../components/Bankcard";
import AddBankModal from "../components/AddBankModal";
import { useAuth } from "@clerk/clerk-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [banks, setBanks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBank, setEditBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
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
      setError("Failed to fetch bank accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      setError("Failed to save bank account. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) {
      return;
    }

    try {
      const token = await getToken();
      
      await axios.delete(`${backendUrl}/api/banks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("✅ Bank deleted");
      fetchBanks();
    } catch (error) {
      console.error("Error deleting bank:", error);
      setError("Failed to delete bank account. Please try again.");
    }
  };

  const handleEdit = (bank) => {
    setEditBank(bank);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditBank(null);
    setModalOpen(true);
  };

  useEffect(() => {
    const syncUserToDB = async () => {
      if (user?.id) {
        try {
          await axios.post(`${backendUrl}/api/users/sync`, {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            username: user.username || user.firstName || "Unknown",
          });
          fetchBanks();
        } catch (err) {
          console.error("❌ Error syncing user:", err);
          setError("Failed to sync user data. Please refresh the page.");
        }
      }
    };
    syncUserToDB();
  }, [user]);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Bank Account Manager</h1>
        <p className="page-subtitle">
          Manage all your bank accounts in one secure place. Add, edit, and organize your financial information with ease.
        </p>
      </div>

      {/* Dashboard Header */}
      <div className="header">
        <h2>My Bank Accounts</h2>
        <button className="btn btn-primary large" onClick={handleAddNew}>
          <span>+</span>
          Add New Account
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{
          background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          border: '1px solid #fca5a5',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          color: '#dc2626',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading">
          Loading your bank accounts...
        </div>
      )}

      {/* Bank Cards Grid */}
      {!loading && (
        <>
          {banks.length === 0 ? (
            <div className="no-data">
              <p>No bank accounts found.</p>
              <p style={{ marginTop: 'var(--space-2)', fontSize: '1rem' }}>
                Get started by adding your first bank account!
              </p>
              <button 
                className="btn btn-primary" 
                onClick={handleAddNew}
                style={{ marginTop: 'var(--space-4)' }}
              >
                Add Your First Account
              </button>
            </div>
          ) : (
            <div className="bank-list">
              {banks.map((bank) => (
                <BankCard
                  key={bank._id}
                  bank={bank}
                  onEdit={() => handleEdit(bank)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Bank Modal */}
      {modalOpen && (
        <AddBankModal
          bank={editBank}
          onClose={() => {
            setModalOpen(false);
            setEditBank(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
