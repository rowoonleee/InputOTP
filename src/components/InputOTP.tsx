import "@/styles/InputOTP.scss";

function InputOTP() {
  return (
    <div className="container">
      <InputSingleOTP />
      <InputSingleOTP />
      <InputSingleOTP />
      <InputSingleOTP />
      <InputSingleOTP />
      <InputSingleOTP />
    </div>
  );
}

function InputSingleOTP() {
  return (
    <input
      className="single-input"
      maxLength={1}
      type="text"
      inputMode="numeric"
    />
  );
}

export default InputOTP;
