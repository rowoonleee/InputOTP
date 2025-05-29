import { useEffect, useRef } from "react";
import "@/styles/InputOTP.scss";

function InputOTP() {
  const inputs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  );

  useEffect(() => {
    focusInput(); // 컴포넌트 마운트 -> 바로 첫 번째 칸 포커스
  }, []);

  // 모든 칸이 입력되지 않은 경우 -> 현재 입력되지 않은 첫 번째 칸 포커스
  // 모든 칸이 입력된 경우 -> 마지막 칸 포커스
  const focusInput = () => {
    const firstEmptyIndex = inputs.findIndex(
      (ref) => ref.current?.value === ""
    );
    inputs[
      firstEmptyIndex === -1 ? inputs.length - 1 : firstEmptyIndex
    ].current?.focus();
  };

  return (
    <div className="container" onMouseDown={focusInput}>
      {inputs.map((ref, index) => (
        <InputSingleOTP key={index} inputRef={ref} />
      ))}
    </div>
  );
}

function InputSingleOTP({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <input
      ref={inputRef}
      className="single-input"
      maxLength={1}
      type="text"
      inputMode="numeric"
      onMouseDown={(e) => {
        e.preventDefault(); // 직접 포커스 방지
      }}
    />
  );
}

export default InputOTP;
