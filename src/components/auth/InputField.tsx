"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

 import type { InputFieldProps } from "@/lib/types";
 import  { Input } from "@/components/ui/input";
 import Button from "@/components/ui/button";

export default function InputField({
  label,
  type,
  placeholder,
  registration,
  error,
  autoComplete,
  avatar,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>

      {/* Label */}
      <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
        {label}
      </label>

      {/* Input wrapper */}
      <div style={{ position:"relative" }}>
        <Input
          {...registration}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width:          "100%",
            padding:        isPassword ? "13px 44px 13px 16px" : "13px 16px",
            borderRadius:   10,
            border:         error
              ? "1px solid rgba(220,60,60,0.6)"
              : "1px solid rgba(255,255,255,0.08)",
            background:     "rgba(255,255,255,0.04)",
            color:          "#fff",
            fontSize:       14,
            outline:        "none",
            transition:     "border-color .2s, background .2s",
            boxSizing:      "border-box",
          }}
          onFocus={e => {
            if (!error) e.currentTarget.style.borderColor = "rgba(255,107,26,0.6)";
            e.currentTarget.style.background = "rgba(255,107,26,0.04)";
          }}
          onBlur={e => {
            if (!error) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        />

        {/* Toggle password */}
        {isPassword && (
            <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)", padding:0, display:"flex", alignItems:"center" }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <span style={{ fontSize:11, color:"rgba(220,80,80,0.9)", display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:4, height:4, borderRadius:"50%", background:"rgba(220,80,80,0.9)", display:"inline-block", flexShrink:0 }} />
          {error}
        </span>
      )}
    </div>
  );
}