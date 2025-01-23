import React from "react";
import classes from "./groupBox.module.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { notify } from "../../../utils/toasts";
import { setClickedAddGroup } from "../../../store/features/groups/groupsSlice.js";
import { useDispatch } from "react-redux";

const AddGroup = () => {
  const dispatch = useDispatch();
  const handleAddGroup = () => {
    notify("adding grp");
    dispatch(setClickedAddGroup(true));
  };

  return (
    <div className={classes["group-add"]} onClick={handleAddGroup}>
      <IoMdAddCircleOutline style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
export default AddGroup;
