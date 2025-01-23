import React from "react";

const EmailInput = ({ value, onChange }) => {
  return (
    <input
      placeholder="Email"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default EmailInput;
