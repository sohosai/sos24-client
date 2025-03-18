/* eslint-disable unused-imports/no-unused-vars */

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
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="col-span-1">
          <CategorySection
            title="委員会"
            field="committee"
            items={["委員会でない", "委員会"]}
            value={value}
            onToggle={toggleField}
            onToggleAll={toggleAll}
            isDisabled={isDisabled}
          />

          <div className="mt-6">
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
          items={["屋内", "屋外"]}
          nestedItems={{ ステージ: ["UNITED", "1A", "会館"] }}
          value={value}
          onToggle={toggleField}
          onToggleAll={toggleAll}
          isDisabled={isDisabled}
        />

        <CategorySection
          title="食品"
          field="food"
          items={["食品なし"]}
          nestedItems={{
            食品あり: ["仕込み場必要", "仕込み場不要", "既製食品販売"],
          }}
          value={value}
          onToggle={toggleField}
          onToggleAll={toggleAll}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default ProjectTypeSelector;

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
    <div className="flex flex-col relative">
      <h3 className="text-sm mb-6 font-bold">{title}</h3>

      <div className="border border-gray-400 border-dashed rounded-lg px-2 sm:px-4 py-4 shadow-sm relative">
        <label className="absolute -top-3 left-2 bg-white px-2 flex items-center gap-2 cursor-pointer text-black font-bold text-xs">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={() => onToggleAll(field, items, nestedItems)}
            disabled={isDisabled}
            className="hidden"
          />
          <span
            className={`w-5 h-5 flex items-center justify-center border-[1.5px] rounded-md transition-all
              ${
                isAllSelected
                  ? "bg-[#5800C7] border-[#5800C7] text-white"
                  : "border-[#D8D8D8] bg-[#EDEDED] border-[1px]"
              }
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-purple-500"}
            `}>
            {isAllSelected && "✔"}
          </span>
          すべて
        </label>

        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 pl-4 cursor-pointer hover:bg-gray-100 rounded-md p-2 transition-all text-xs font-bold">
            <input
              type="checkbox"
              checked={value[field].includes(item)}
              onChange={() => onToggle(field, item)}
              disabled={isDisabled}
              className="hidden"
            />
            <span
              className={`w-5 h-5 flex items-center justify-center border-[1.5px] rounded-md transition-all font-bold text-[14px]
                ${
                  value[field].includes(item)
                    ? "bg-[#5800C7] border-[#5800C7] text-white"
                    : "border-[#A49E9E] bg-[#EDEDED] text-[#A49E9E]"
                }
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-purple-500"}
              `}>
              ＋
            </span>
            {item}
          </label>
        ))}

        {nestedItems &&
          Object.entries(nestedItems).map(([parent, subItems]) => (
            <div
              key={parent}
              className="relative flex flex-col border border-gray-300 border-dashed rounded-md mt-4 p-3">
              <label className="absolute -top-3 left-2 bg-white px-2 flex items-center gap-3 cursor-pointer font-bold text-xs">
                <input
                  type="checkbox"
                  checked={value[field].includes(parent) || subItems.every((sub) => value[field].includes(sub))}
                  onChange={() => onToggle(field, parent, subItems)}
                  disabled={isDisabled}
                  className="hidden"
                />

                <span
                  className={`w-5 h-5 flex items-center justify-center border-[1.5px] rounded-md transition-all font-bold text-[14px]
                    ${
                      subItems.every((sub) => value[field].includes(sub))
                        ? "bg-[#5800C7] border-[#5800C7] text-white"
                        : "border-[#A49E9E] bg-[#EDEDED] text-[#A49E9E]"
                    }
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-purple-500"}
                  `}>
                  ＋
                </span>
                {parent}
              </label>

              <div className="pl-3 mt-2 pr-8">
                {subItems.map((subItem) => (
                  <label
                    key={subItem}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-md p-2 transition-all text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={value[field].includes(subItem)}
                      onChange={() => onToggle(field, subItem)}
                      disabled={isDisabled}
                      className="hidden"
                    />
                    <span
                      className={`w-5 h-5 flex items-center justify-center border-[1.5px] rounded-md transition-all font-bold text-[14px]
                        ${
                          value[field].includes(subItem)
                            ? "bg-[#5800C7] border-[#5800C7] text-white"
                            : "border-[#A49E9E] bg-[#EDEDED] text-[#A49E9E]"
                        }
                        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-purple-500"}
                      `}>
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
