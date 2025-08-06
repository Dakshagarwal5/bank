import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Admin() {
  const [banks, setBanks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const fetchAllBanks = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const res = await axios.get(`${backendUrl}/api/banks/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setBanks(res.data);
    } catch (error) {
      console.error("Error fetching all banks:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchBanks = async () => {
    if (!searchQuery.trim()) {
      fetchAllBanks();
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      
      const res = await axios.get(`${backendUrl}/api/banks/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setBanks(res.data);
    } catch (error) {
      console.error("Error searching banks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBanks();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchBanks();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  return (
    <div className="container">
      <div className="header">
        <h2>Admin Dashboard - All Bank Accounts</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by bank name or IFSC code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : banks.length === 0 ? (
        <div className="no-data">
          <p>No bank accounts found.</p>
        </div>
      ) : (
        <div className="admin-bank-list">
          <table className="bank-table">
            <thead>
              <tr>
                <th>Account Holder</th>
                <th>Bank Name</th>
                <th>Branch</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                <th>User Email</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank._id}>
                  <td>{bank.accountHolderName}</td>
                  <td>{bank.bankName}</td>
                  <td>{bank.branchName}</td>
                  <td>{bank.accountNumber}</td>
                  <td>{bank.ifscCode}</td>
                  <td>{bank.user?.email || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}