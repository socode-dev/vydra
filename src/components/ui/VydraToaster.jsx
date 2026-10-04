import { Toaster } from "react-hot-toast";

const VydraToaster = () => (
  <Toaster
    position="top-right"
    gutter={10}
    toastOptions={{
      duration: 3500,
      className: "vydra-toast",
      success: { className: "vydra-toast vydra-toast-success" },
      error: { className: "vydra-toast vydra-toast-error" },
    }}
  />
);

export default VydraToaster;
