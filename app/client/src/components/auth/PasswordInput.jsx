import React from "react";

const PasswordInput = ({ value, onChange }) => {
  return (
    <input
      placeholder="Password"
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default PasswordInput;
