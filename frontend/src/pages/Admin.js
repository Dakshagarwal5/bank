import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Admin({ token }) {
  const [banks, setBanks] = useState([]);
  const [allBanks, setAllBanks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAccounts: 0,
    uniqueBanks: 0,
    uniqueUsers: 0
  });

  const calculateStats = (bankData) => {
    const uniqueBanks = new Set(bankData.map(bank => bank.bankName)).size;
    const uniqueUsers = new Set(bankData.map(bank => bank.user?.email).filter(Boolean)).size;
    
    setStats({
      totalAccounts: bankData.length,
      uniqueBanks,
      uniqueUsers
    });
  };

  const fetchAllBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`${backendUrl}/api/banks/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setBanks(res.data);
      setAllBanks(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("Error fetching all banks:", error);
      setError("Failed to fetch bank accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchBanks = async () => {
    if (!searchQuery.trim()) {
      setBanks(allBanks);
      return;
    }

    try {
      setLoading(true);
      
      const res = await axios.get(`${backendUrl}/api/banks/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setBanks(res.data);
    } catch (error) {
      console.error("Error searching banks:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return "N/A";
    // Show first 4 and last 4 digits for admin view
    if (accountNumber.length > 8) {
      return `${accountNumber.slice(0, 4)}****${accountNumber.slice(-4)}`;
    }
    return accountNumber;
  };

  const getBankIcon = (bankName) => {
    const icons = {
      'SBI': '🏛️',
      'HDFC': '🏦',
      'ICICI': '💼',
      'AXIS': '⭐',
      'PNB': '🏢',
      'BOI': '🏪',
      'CANARA': '🏬',
      'UNION': '🏭',
      'default': '🏛️'
    };
    
    const bankKey = Object.keys(icons).find(key => 
      bankName?.toLowerCase().includes(key.toLowerCase())
    );
    
    return icons[bankKey] || icons.default;
  };

  useEffect(() => {
    fetchAllBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchBanks();
    }, 500);

    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">
          Monitor and manage all bank accounts across the platform. View user data and account statistics.
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>📊</div>
          <h3 style={{ 
            fontSize: '2rem', 
            fontWeight: 'var(--font-weight-bold)', 
            color: 'var(--primary-600)',
            margin: 0
          }}>
            {stats.totalAccounts}
          </h3>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>
            Total Accounts
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🏦</div>
          <h3 style={{ 
            fontSize: '2rem', 
            fontWeight: 'var(--font-weight-bold)', 
            color: 'var(--secondary-600)',
            margin: 0
          }}>
            {stats.uniqueBanks}
          </h3>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>
            Unique Banks
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>👥</div>
          <h3 style={{ 
            fontSize: '2rem', 
            fontWeight: 'var(--font-weight-bold)', 
            color: 'var(--success-600)',
            margin: 0
          }}>
            {stats.uniqueUsers}
          </h3>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>
            Active Users
          </p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="header">
        <h2>All Bank Accounts</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by bank name, IFSC code, or account holder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
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
          Loading bank accounts...
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          {banks.length === 0 ? (
            <div className="no-data">
              <p>{searchQuery ? "No accounts match your search." : "No bank accounts found."}</p>
              {searchQuery && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setSearchQuery("")}
                  style={{ marginTop: 'var(--space-4)' }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div style={{
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                textAlign: 'center',
                color: 'var(--primary-700)'
              }}>
                {searchQuery ? (
                  <p style={{ margin: 0 }}>
                    Found <strong>{banks.length}</strong> account{banks.length !== 1 ? 's' : ''} matching "<strong>{searchQuery}</strong>"
                  </p>
                ) : (
                  <p style={{ margin: 0 }}>
                    Showing <strong>{banks.length}</strong> total account{banks.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Results Table */}
              <div className="table-container">
                <table className="bank-table">
                  <thead>
                    <tr>
                      <th>Bank</th>
                      <th>Account Holder</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                      <th>Branch</th>
                      <th>User Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banks.map((bank) => (
                      <tr key={bank._id}>
                        <td>
                          <span style={{ marginRight: 'var(--space-2)' }}>
                            {getBankIcon(bank.bankName)}
                          </span>
                          {bank.bankName}
                        </td>
                        <td>{bank.accountHolderName || 'N/A'}</td>
                        <td>{formatAccountNumber(bank.accountNumber)}</td>
                        <td>
                          <code style={{
                            background: 'var(--gray-100)',
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace'
                          }}>
                            {bank.ifscCode}
                          </code>
                        </td>
                        <td>{bank.branchName || 'N/A'}</td>
                        <td>{bank.user?.email || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}