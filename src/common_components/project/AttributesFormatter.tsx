export const AttributesFormatter = ({ attribute }: { attribute: string }) => {
  switch (attribute) {
    case "academic":
      return "学術認定企画";
    case "art":
      return "芸術祭参加企画";
    case "inside":
      return "屋内";
    case "outside":
      return "屋外";
    case "official":
      return "委員会開催企画";
    default:
      return "";
  }
};
