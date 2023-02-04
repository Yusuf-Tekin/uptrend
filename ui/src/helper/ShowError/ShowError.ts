import { toast } from "react-toastify";

export const ShowError = (err: any) => {
  if (err.response) {
    const message = err.response.data.message;
    if (message) {
      toast.error(message);
    } else {
      const errors = err.response.data.errors?.errors || err.response.data.errors;
      if (errors) {
        errors.forEach((error: any) => {
          toast.error(error.message);
        });
      }
    }
  } else {
    toast.error("Beklenmeyen bir problem oluştu!");
  }
};
