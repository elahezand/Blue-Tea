import toast from "react-hot-toast";

export const showToast = (message, type = "default") => {
  if (type === "success") toast.success(message);
  else if (type === "destructive") toast.error(message);
  else toast(message);
};

export const manageError = (error) => {
  let message = null
  if (error === 400) message = "Please fill out required fields correctly.";
  else if (error === 401 || error === 403) message = "Unauthorized request.";
  else if (error === 404) message = "Not found.";
  else if (error === 409) message = "This account already exists.";
  else if (error === 410) message = "Code expired.";
  else if (error === 422) message = "Your information is not valid.";
  else if (error === 500) message = "Server error.";
  else message = `Unexpected error (${error || "unknown"})`;

  toast.error(message);
};