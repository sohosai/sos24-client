import { UseFormRegisterReturn } from "react-hook-form";

export type basicFieldProps = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  register: UseFormRegisterReturn;
};
