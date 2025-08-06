import React from "react";

export default function BankCard({ bank, onEdit, onDelete }) {
  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return "N/A";
    // Show only last 4 digits for security
    const lastFour = accountNumber.slice(-4);
    return `****${lastFour}`;
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

  return (
    <div className="bank-card">
      {/* Bank Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)'
      }}>
        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '1.5rem' }}>{getBankIcon(bank.bankName)}</span>
          {bank.bankName}
        </h4>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
          color: 'var(--primary-700)',
          padding: 'var(--space-1) var(--space-3)',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.75rem',
          fontWeight: 'var(--font-weight-semibold)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Active
        </div>
      </div>

      {/* Account Details */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ 
          display: 'grid', 
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: 'var(--space-2)',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)'
          }}>
            <span style={{ fontSize: '1rem', marginRight: 'var(--space-2)' }}>🔢</span>
            <div>
              <strong style={{ 
                color: 'var(--gray-800)', 
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Account Number
              </strong>
              <div style={{ 
                color: 'var(--gray-600)', 
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                {formatAccountNumber(bank.accountNumber)}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: 'var(--space-2)',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)'
          }}>
            <span style={{ fontSize: '1rem', marginRight: 'var(--space-2)' }}>🏪</span>
            <div>
              <strong style={{ 
                color: 'var(--gray-800)', 
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Branch
              </strong>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                {bank.branchName || "N/A"}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: 'var(--space-2)',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)'
          }}>
            <span style={{ fontSize: '1rem', marginRight: 'var(--space-2)' }}>🏷️</span>
            <div>
              <strong style={{ 
                color: 'var(--gray-800)', 
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                IFSC Code
              </strong>
              <div style={{ 
                color: 'var(--gray-600)', 
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                {bank.ifscCode || "N/A"}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: 'var(--space-2)',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)'
          }}>
            <span style={{ fontSize: '1rem', marginRight: 'var(--space-2)' }}>👤</span>
            <div>
              <strong style={{ 
                color: 'var(--gray-800)', 
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Account Holder
              </strong>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                {bank.accountHolderName || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        <button 
          className="btn btn-secondary small" 
          onClick={onEdit}
          style={{ flex: 1 }}
        >
          <span>✏️</span>
          Edit
        </button>
        <button 
          className="btn btn-danger small" 
          onClick={() => onDelete(bank._id)}
          style={{ flex: 1 }}
        >
          <span>🗑️</span>
          Delete
        </button>
      </div>
    </div>
  );
}
