import { FC } from "react";
import { components } from "@/schema";

export const UserRoleFormatter: FC<{
  role: components["schemas"]["UserRole"];
}> = ({ role }) => {
  switch (role) {
    case "administrator":
      return "SOS管理者";
    case "committee_operator":
      return "実委人（管理者）";
    case "committee":
      return "実委人";
    case "general":
      return "一般";
  }
};
