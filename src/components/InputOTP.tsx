import { useEffect, useRef } from "react";
import "@/styles/InputOTP.scss";

const OTP_LENGTH = 6;

function InputOTP() {
  const inputs = Array.from({ length: OTP_LENGTH }, () =>
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
      firstEmptyIndex === -1 ? OTP_LENGTH - 1 : firstEmptyIndex
    ].current?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // 숫자 및 삭제 입력이 아닌 경우 무시
    // TODO : Delete 도 처리해야 할까?
    // TODO : 한글 입력이 막아지지 않음
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
      return;
    }
    // backspace 시 이전 칸으로 이동 (마지막 칸에서 입력 내용이 있는 경우 제외)
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      const prevInput = inputs[index - 1];
      if (prevInput) prevInput.current?.focus();
    }
    // 마지막 칸에서 숫자 입력 시 업데이트 (기존 값 지움)
    if (index === OTP_LENGTH - 1) {
      const input = inputs[index].current;
      if (input) input.value = "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    // 입력 시 다음 칸으로 이동
    if (e.target.value !== "") {
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.current?.focus();
    }
  };

  return (
    <div className="container" onMouseDown={focusInput}>
      {inputs.map((ref, index) => (
        <InputSingleOTP
          key={index}
          inputRef={ref}
          index={index}
          handleKeyDown={handleKeyDown}
          handleChange={handleChange}
        />
      ))}
    </div>
  );
}

function InputSingleOTP({
  inputRef,
  index,
  handleKeyDown,
  handleChange,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  index: number;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
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
      onKeyDown={(e) => handleKeyDown(e, index)}
      onChange={(e) => handleChange(e, index)}
    />
  );
}

export default InputOTP;
