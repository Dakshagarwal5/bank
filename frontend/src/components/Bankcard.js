import React from "react";

export default function BankCard({ bank, onEdit, onDelete }) {
  return (
    <div className="bank-card">
      <h4>{bank.bankName}</h4>
      <p><strong>IFSC:</strong> {bank.ifscCode}</p>
      <p><strong>Branch:</strong> {bank.branchName}</p>
      <p><strong>Account No:</strong> {bank.accountNumber}</p>
      <p><strong>Holder:</strong> {bank.accountHolderName}</p>
      <div className="actions">
        <button className="btn small" onClick={onEdit}>Edit</button>
        <button className="btn small danger" onClick={() => onDelete(bank._id)}>Delete</button>
      </div>
    </div>
  );
}
