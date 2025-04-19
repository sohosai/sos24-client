/* eslint-disable unused-imports/no-unused-vars */
import { css } from "@styled-system/css";

export type ProjectType = {
  location: string[];
  food: string[];
  committee: string[];
  attributes: string[];
};

type Props = {
  value: ProjectType;
  onChange: ((_: ProjectType) => void) | null;
};

const ProjectTypeSelector = ({ value, onChange }: Props): JSX.Element => {
  const isDisabled = onChange === null;

  const toggleField = (field: keyof ProjectType, item: string, subItems?: string[]) => {
    if (isDisabled) return;

    let updatedField = value[field].includes(item) ? value[field].filter((i) => i !== item) : [...value[field], item];

    if (subItems) {
      updatedField = subItems.every((sub) => value[field].includes(sub))
        ? updatedField.filter((i) => !subItems.includes(i) && i !== item)
        : [...updatedField, item, ...subItems];
    }

    onChange({ ...value, [field]: updatedField });
  };

  const toggleAll = (field: keyof ProjectType, items: string[], nestedItems?: { [key: string]: string[] }) => {
    if (isDisabled) return;

    const allItems = [...items, ...(nestedItems ? Object.values(nestedItems).flat() : [])];
    const isAllSelected = allItems.every((item) => value[field].includes(item));

    onChange({ ...value, [field]: isAllSelected ? [] : allItems });
  };

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "1.5rem" })}>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          alignItems: "start",
        })}>
        <div className={css({ gridColumn: "span 1" })}>
          <CategorySection
            title="委員会"
            field="committee"
            items={["委員会でない", "委員会"]}
            value={value}
            onToggle={toggleField}
            onToggleAll={toggleAll}
            isDisabled={isDisabled}
          />

          <div className={css({ marginTop: "1.5rem" })}>
            <CategorySection
              title="属性"
              field="attributes"
              items={["その他", "学術", "芸術"]}
              value={value}
              onToggle={toggleField}
              onToggleAll={toggleAll}
              isDisabled={isDisabled}
            />
          </div>
        </div>

        <CategorySection
          title="場所"
          field="location"
          items={[]}
          nestedItems={{ 一般: ["屋内", "屋外"], ステージ: ["UNITED", "1A", "会館"] }}
          value={value}
          onToggle={toggleField}
          onToggleAll={toggleAll}
          isDisabled={isDisabled}
        />

        <CategorySection
          title="食品"
          field="food"
          items={["食品なし"]}
          nestedItems={{ 食品あり: ["仕込み場必要", "仕込み場不要", "既製食品販売"] }}
          value={value}
          onToggle={toggleField}
          onToggleAll={toggleAll}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

const CategorySection = ({
  title,
  field,
  items,
  nestedItems,
  value,
  onToggle,
  onToggleAll,
  isDisabled,
}: {
  title: string;
  field: keyof ProjectType;
  items: string[];
  nestedItems?: { [key: string]: string[] };
  value: ProjectType;
  onToggle: (field: keyof ProjectType, item: string, subItems?: string[]) => void;
  onToggleAll: (field: keyof ProjectType, items: string[], nestedItems?: { [key: string]: string[] }) => void;
  isDisabled: boolean;
}) => {
  const isAllSelected = [...items, ...(nestedItems ? Object.values(nestedItems).flat() : [])].every((item) =>
    value[field].includes(item),
  );

  return (
    <div className={css({ display: "flex", flexDirection: "column", position: "relative" })}>
      <h3 className={css({ fontSize: "sm", marginBottom: "1.5rem", fontWeight: "bold" })}>{title}</h3>

      <div
        className={css({
          borderWidth: "1px",
          borderColor: "gray.400",
          borderStyle: "dashed",
          borderRadius: "lg",
          paddingX: { base: "0.5rem", sm: "1rem" },
          paddingY: "1rem",
          position: "relative",
        })}>
        <label
          className={css({
            position: "absolute",
            top: "-0.75rem",
            left: "0.5rem",
            backgroundColor: "white",
            paddingX: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "xs",
          })}>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={() => onToggleAll(field, items, nestedItems)}
            disabled={isDisabled}
            hidden
          />
          <span
            className={css({
              width: "1.25rem",
              height: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: "1.5px",
              borderRadius: "md",
              transition: "all",
              backgroundColor: isAllSelected ? "#5800C7" : "#EDEDED",
              borderColor: isAllSelected ? "#5800C7" : "#D8D8D8",
              opacity: isDisabled ? 0.5 : 1,
              color: isAllSelected ? "#FFFFFF" : "transparent",
              cursor: isDisabled ? "not-allowed" : "pointer",
            })}>
            ✔︎
          </span>
          すべて
        </label>

        {items.map((item) => (
          <label
            key={item}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              paddingLeft: "1rem",
              cursor: "pointer",
              borderRadius: "md",
              padding: "0.5rem",
              transition: "all",
              fontSize: "xs",
              fontWeight: "bold",
              _hover: { backgroundColor: "gray.100" },
            })}>
            <input
              type="checkbox"
              checked={value[field].includes(item)}
              onChange={() => onToggle(field, item)}
              disabled={isDisabled}
              hidden
            />
            <span
              className={css({
                width: "1.25rem",
                height: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: "1.5px",
                borderRadius: "md",
                transition: "all",
                fontWeight: "bold",
                fontSize: "14px",
                paddingBottom: "1px",
                backgroundColor: value[field].includes(item) ? "#5800C7" : "#EDEDED",
                borderColor: value[field].includes(item) ? "#5800C7" : "#A49E9E",
                color: value[field].includes(item) ? "white" : "#A49E9E",
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
              })}>
              ＋
            </span>
            {item}
          </label>
        ))}

        {nestedItems &&
          Object.entries(nestedItems).map(([parent, subItems]) => (
            <div
              key={parent}
              className={css({
                display: "flex",
                flexDirection: "column",
                borderWidth: "1px",
                borderColor: "gray.300",
                borderStyle: "dashed",
                borderRadius: "md",
                marginTop: "1rem",
                padding: "0.75rem",
                position: "relative",
              })}>
              <label
                className={css({
                  position: "absolute",
                  top: "-0.75rem",
                  left: "0.5rem",
                  backgroundColor: "white",
                  paddingX: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "xs",
                })}>
                <input
                  type="checkbox"
                  checked={value[field].includes(parent) || subItems.every((sub) => value[field].includes(sub))}
                  onChange={() => onToggle(field, parent, subItems)}
                  disabled={isDisabled}
                  hidden
                />
                <span
                  className={css({
                    width: "1.25rem",
                    height: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: "1.5px",
                    borderRadius: "md",
                    transition: "all",
                    fontWeight: "bold",
                    fontSize: "14px",
                    paddingBottom: "1px",
                    backgroundColor: subItems.every((sub) => value[field].includes(sub)) ? "#5800C7" : "#EDEDED",
                    borderColor: subItems.every((sub) => value[field].includes(sub)) ? "#5800C7" : "#A49E9E",
                    color: subItems.every((sub) => value[field].includes(sub)) ? "white" : "#A49E9E",
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  })}>
                  ＋
                </span>
                {parent}
              </label>
              <div className={css({ paddingLeft: "0.75rem", marginTop: "0.5rem", paddingRight: "2rem" })}>
                {subItems.map((subItem) => (
                  <label
                    key={subItem}
                    className={css({
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                      borderRadius: "md",
                      padding: "0.5rem",
                      transition: "all",
                      fontSize: "xs",
                      fontWeight: "bold",
                      _hover: { backgroundColor: "gray.100" },
                    })}>
                    <input
                      type="checkbox"
                      checked={value[field].includes(subItem)}
                      onChange={() => onToggle(field, subItem)}
                      disabled={isDisabled}
                      hidden
                    />
                    <span
                      className={css({
                        width: "1.25rem",
                        height: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: "1.5px",
                        borderRadius: "md",
                        transition: "all",
                        fontWeight: "bold",
                        fontSize: "14px",
                        paddingBottom: "1px",
                        backgroundColor: value[field]?.includes(subItem) ? "#5800C7" : "#EDEDED",
                        borderColor: value[field]?.includes(subItem) ? "#5800C7" : "#A49E9E",
                        color: value[field]?.includes(subItem) ? "white" : "#A49E9E",
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                      })}>
                      ＋
                    </span>
                    {subItem}
                  </label>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectTypeSelector;
