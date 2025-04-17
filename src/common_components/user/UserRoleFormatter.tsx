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
    case "committee_editor":
      return "実委人（編集者）";
    case "committee_drafter":
      return "実委人（起草者）";
    case "committee_viewer":
      return "実委人（閲覧者）";
    case "general":
      return "一般";
  }
};
