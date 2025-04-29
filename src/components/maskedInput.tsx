import React, { forwardRef } from "react";
import InputMask from "react-input-mask";
import { Input } from "@/components/ui/input"; // Shadcn Input

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}
const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value, onChange, placeholder, ...rest }, ref) => {
    return (
      <InputMask
        mask={mask}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputRef={ref} // repassa o ref corretamente
        {...rest}
      >
        {(inputProps) => <Input {...inputProps} />}
      </InputMask>
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export default MaskedInput;
