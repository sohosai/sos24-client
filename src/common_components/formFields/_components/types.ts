import { UseFormRegisterReturn } from "react-hook-form";

export type basicFieldProps = {
  id: string;
  label: string;
  description?: string | null;
  required?: boolean;
  error?: string;
  register: UseFormRegisterReturn;
};
