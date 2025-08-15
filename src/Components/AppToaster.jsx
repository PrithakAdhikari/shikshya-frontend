import { Toaster } from "react-hot-toast";
import { useTheme } from "../Contexts/useTheme";

const AppToaster = () => {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          backgroundColor: "var(--color-base-100)",       // bg-base-100
          color: "var(--color-base-content)",                 // text-base-content
          boxShadow: isDark
            ? "0 2px 8px rgb(147 197 253 / 0.3)"  // subtle blue shadow in dark
            : "0 2px 8px rgb(0 0 0 / 0.1)",        // subtle shadow in light
          borderRadius: "0.5rem",
          fontWeight: "600",
        },
        success: {
          iconTheme: {
            primary: "var(--success)",       // success color from DaisyUI
            secondary: "var(--b1)",          // bg-base-100
          },
        },
        error: {
          iconTheme: {
            primary: "var(--error)",         // error color from DaisyUI
            secondary: "var(--b1)",
          },
        },
      }}
    />
  );
};

export default AppToaster;
