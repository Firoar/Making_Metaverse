import React from "react";

const UserInput = ({ value, onChange }) => {
  return (
    <input
      placeholder="Username"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default UserInput;
