import { toast } from "react-toastify";

export const notify = (message, type) => {
  if (type === "success") {
    toast.success(message, {
      position: "top-center",
    });
  } else if (type === "error") {
    toast.error(message, {
      position: "top-center",
    });
  } else {
    toast(message, {
      position: "top-center",
    });
  }
};
