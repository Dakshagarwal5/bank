import React, { useState, useEffect } from "react";

export default function AddBankModal({ bank, onClose, onSave }) {
  const [form, setForm] = useState({
    ifscCode: "",
    branchName: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bank) {
      setForm(bank);
    }
  }, [bank]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (!form.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.toUpperCase())) {
      newErrors.ifscCode = "Invalid IFSC code format";
    }

    if (!form.branchName.trim()) {
      newErrors.branchName = "Branch name is required";
    }

    if (!form.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (form.accountNumber.length < 9 || form.accountNumber.length > 18) {
      newErrors.accountNumber = "Account number must be 9-18 digits";
    }

    if (!form.accountHolderName.trim()) {
      newErrors.accountHolderName = "Account holder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format IFSC code to uppercase
      const formattedForm = {
        ...form,
        ifscCode: form.ifscCode.toUpperCase(),
        bankName: form.bankName.trim(),
        branchName: form.branchName.trim(),
        accountHolderName: form.accountHolderName.trim(),
        accountNumber: form.accountNumber.trim(),
      };
      
      await onSave(formattedForm);
    } catch (error) {
      console.error("Error saving bank:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: "bankName",
      label: "Bank Name",
      placeholder: "e.g., State Bank of India",
      icon: "🏛️",
      type: "text"
    },
    {
      name: "ifscCode",
      label: "IFSC Code",
      placeholder: "e.g., SBIN0000123",
      icon: "🏷️",
      type: "text",
      transform: (value) => value.toUpperCase()
    },
    {
      name: "branchName",
      label: "Branch Name",
      placeholder: "e.g., Main Branch",
      icon: "🏪",
      type: "text"
    },
    {
      name: "accountNumber",
      label: "Account Number",
      placeholder: "Enter your account number",
      icon: "🔢",
      type: "text"
    },
    {
      name: "accountHolderName",
      label: "Account Holder Name",
      placeholder: "Enter full name as per bank records",
      icon: "👤",
      type: "text"
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {bank ? "✏️" : "➕"}
            </span>
            {bank ? "Edit Bank Account" : "Add New Bank Account"}
          </h3>
          <p style={{ 
            color: 'var(--gray-600)', 
            fontSize: '0.875rem',
            marginTop: 'var(--space-2)',
            margin: 0
          }}>
            {bank ? "Update your bank account information" : "Enter your bank account details below"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name} className="form-group">
              <label className="form-label" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)' 
              }}>
                <span style={{ fontSize: '1rem' }}>{field.icon}</span>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                className={`form-input ${errors[field.name] ? 'error' : ''}`}
                placeholder={field.placeholder}
                value={field.transform ? field.transform(form[field.name]) : form[field.name]}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                style={{
                  borderColor: errors[field.name] ? 'var(--error-500)' : undefined,
                  boxShadow: errors[field.name] ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
                }}
              />
              {errors[field.name] && (
                <div style={{
                  color: 'var(--error-600)',
                  fontSize: '0.75rem',
                  marginTop: 'var(--space-1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)'
                }}>
                  <span>⚠️</span>
                  {errors[field.name]}
                </div>
              )}
            </div>
          ))}

          <div className="actions" style={{ marginTop: 'var(--space-8)' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span>❌</span>
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn ${bank ? 'btn-primary' : 'btn-success'}`}
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{isSubmitting ? "⏳" : (bank ? "💾" : "➕")}</span>
              {isSubmitting ? "Saving..." : (bank ? "Update Account" : "Add Account")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
