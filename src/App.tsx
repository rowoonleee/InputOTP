import "./App.css";
import InputOTPDemo from "@/components/InputOTPDemo";
import InputOTP from "@/components/InputOTP";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <InputOTPDemo /> {/* Shadcn component */}
      <InputOTP />
    </div>
  );
}

export default App;
