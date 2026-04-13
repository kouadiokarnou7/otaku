

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Input, Textarea, ReadonlyField } from "@/components/ui/input";

type BaseField = {
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  hint?: string;
  readonlyLabel?: string; // Label affiché en mode lecture (si différent)
};

type InputField = BaseField & {
  type?: "text" | "email" | "tel" | "url";
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  multiline?: false;
};

type TextareaField = BaseField & {
  multiline: true;
  rows?: number;
  maxLength?: number;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

type FormFieldProps = InputField | TextareaField;

export default function FormField(props: FormFieldProps) {
  const { label, name, value, isEditing, hint, readonlyLabel } = props;

  // ── Mode lecture ────────────────────────────────────────────
  if (!isEditing) {
    return (
      <ReadonlyField
        label={readonlyLabel || label}
        value={value}
        hint={hint}
      />
    );
  }

  // ── Mode édition : Textarea ──────────────────────────────────
  if ("multiline" in props && props.multiline) {
    const { rows = 3, maxLength, textareaProps } = props;
    return (
      <Textarea
        label={label}
        name={name}
        value={value}
        rows={rows}
        maxLength={maxLength}
        currentLength={value.length}
        hint={hint}
        {...textareaProps}
      />
    );
  }

  // ── Mode édition : Input ─────────────────────────────────────
  const { type = "text", inputProps } = props as InputField;
  return (
    <Input
      label={label}
      name={name}
      type={type}
      value={value}
      hint={hint}
      {...inputProps}
    />
  );
}