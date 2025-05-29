import { useState, useEffect, useRef, useMemo } from "react";
import "@/styles/InputOTP.scss";

const OTP_LENGTH = 6;

/**
 * OTP(One-Time Password) 6자리 숫자 입력 컴포넌트입니다.
 *
 * @param onChange - 각 자리의 값이 변경될 때 호출되는 콜백. 현재 입력 상태를 문자 배열로 반환합니다.
 * @param onComplete - 모든 자리가 입력 완료되었을 때 호출되는 콜백. 최종 입력 상태를 문자 배열을 반환합니다.
 * @param isValid - 입력된 OTP가 유효한지 여부를 나타내는 플래그입니다. 입력 필드에 스타일을 적용하는 용도로 사용됩니다.
 */
interface InputOTPProps {
  onChange?: (value: string[]) => void;
  onComplete?: (value: string[]) => void;
  isValid?: boolean;
}

function InputOTP(props: InputOTPProps) {
  const { onChange, onComplete, isValid = true } = props;

  const inputs = Array.from({ length: OTP_LENGTH }, () =>
    useRef<HTMLInputElement>(null)
  );
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const isAllFilled = useMemo(
    () => otpValues.every((value) => value !== ""),
    [otpValues]
  );

  useEffect(() => {
    focusInput(); // 컴포넌트 마운트 -> 바로 첫 번째 칸 포커스
  }, []);

  const getFirstEmptyIndex = () =>
    inputs.findIndex((ref) => ref.current?.value === "");

  // 모든 칸이 입력되지 않은 경우 -> 현재 입력되지 않은 첫 번째 칸 포커스
  // 모든 칸이 입력된 경우 -> 마지막 칸 포커스
  const focusInput = () => {
    const firstEmptyIndex = getFirstEmptyIndex();
    inputs[
      firstEmptyIndex === -1 ? OTP_LENGTH - 1 : firstEmptyIndex
    ].current?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // backspace 시 이전 칸으로 이동 (마지막 칸에서 입력 내용이 있는 경우 제외)
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      const prevInput = inputs[index - 1];
      if (prevInput) prevInput.current?.focus();
    }
    // 마지막 칸에서 숫자 입력 시 업데이트 (기존 값 지움)
    if (index === OTP_LENGTH - 1 && /^[0-9]$/.test(e.key)) {
      const input = inputs[index].current;
      if (input) input.value = "";
    }
  };

  const updateOtpValues = () => {
    const newValues = inputs.map((ref) => ref.current?.value ?? "");
    setOtpValues(newValues);
    onChange?.(newValues);
    if (getFirstEmptyIndex() === -1) onComplete?.(newValues);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    // 숫자 이외의 입력 방지
    if (e.target.value !== "" && !/^[0-9]$/.test(e.target.value)) {
      // 마지막 칸에서 숫자 + 문자 입력 시 다 지워지는 문제 방지
      const firstDigit = e.target.value.match(/[0-9]/)?.[0] ?? "";
      const input = inputs[index].current;
      if (input) input.value = firstDigit;
      return;
    }

    updateOtpValues();

    // 입력 시 다음 칸으로 이동 (마지막 칸인 경우 onComplete 호출)
    if (e.target.value !== "") {
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.current?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text");
    const onlyNumber = pastedValue.match(/[0-9]/g);
    if (!onlyNumber) return;

    const emptyInputCount = OTP_LENGTH - getFirstEmptyIndex();
    let i;
    for (i = 0; i < emptyInputCount; i++) {
      if (onlyNumber[i] === undefined) break;
      const input = inputs[index + i]?.current;
      if (input) input.value = onlyNumber[i];
    }

    updateOtpValues();

    const inputRefToFocus = inputs[index + i]
      ? inputs[index + i]
      : inputs[OTP_LENGTH - 1];
    inputRefToFocus.current?.focus();
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
          handlePaste={handlePaste}
          isValid={isValid}
          isAllFilled={isAllFilled}
        />
      ))}
    </div>
  );
}

interface InputSingleOTPProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  index: number;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handlePaste: (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => void;
  isValid?: boolean;
  isAllFilled?: boolean;
}

function InputSingleOTP(props: InputSingleOTPProps) {
  const {
    inputRef,
    index,
    handleKeyDown,
    handleChange,
    handlePaste,
    isValid = true,
    isAllFilled,
  } = props;

  return (
    <input
      ref={inputRef}
      className="single-input"
      // TODO: 스타일링 예시입니다. 필요 없다면 isAllFilled와 isValid 관련 코드, InputOTP.scss에서 valid/invalid 스타일 지정한 부분을 삭제해야 합니다.
      //   className={`single-input ${
      //     inputRef.current?.value
      //       ? isAllFilled && !isValid
      //         ? "invalid"
      //         : "valid"
      //       : ""
      //   }`}
      maxLength={1}
      type="text"
      inputMode="numeric"
      onMouseDown={(e) => {
        e.preventDefault(); // 직접 포커스 방지
      }}
      onKeyDown={(e) => handleKeyDown(e, index)}
      onChange={(e) => handleChange(e, index)}
      onPaste={(e) => handlePaste(e, index)}
    />
  );
}

export default InputOTP;
