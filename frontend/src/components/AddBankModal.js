import React, { useState, useEffect } from "react";

export default function AddBankModal({ bank, onClose, onSave }) {
  const [form, setForm] = useState({
    ifscCode: "",
    branchName: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });

  useEffect(() => {
    if (bank) setForm(bank);
  }, [bank]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h3>{bank ? "Edit" : "Add"} Bank</h3>
        {["ifscCode", "branchName", "bankName", "accountNumber", "accountHolderName"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}
        <div className="actions">
          <button type="submit" className="btn">{bank ? "Update" : "Add"}</button>
          <button type="button" className="btn danger" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
