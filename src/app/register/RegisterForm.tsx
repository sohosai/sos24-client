"use client";

import { useForm, useWatch } from "react-hook-form";
import { css } from "@styled-system/css";
import { RegisterProjectSchema, RegisterProjectSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "@/common_components/Button";
import { TextField } from "./_components/TextField";
import { CategoryField } from "./_components/CategoryField";
import { category_to_type, PlaceField } from "./_components/PlaceField";
import { SingleCheckboxField } from "./_components/SingleCheckboxField";
import { stack } from "@styled-system/patterns";
import { client } from "@/lib/openapi";
import { components } from "@/schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import General from "@/assets/General.svg";
import FoodsWithKitchen from "@/assets/Foods_with_kitchen.svg";
import FoodsWithoutCooking from "@/assets/Foods_without_cooking.svg";
import FoodsWithoutKitchent from "@/assets/Foods_without_kitchen.svg";
import Stage from "@/assets/Stage.svg";

const categoryItems = [
  {
    value: "general",
    label: "普通企画",
    hasTopSpacer: false,
    badges: [],
    icon: <General width={40} height={40} />,
  },
  {
    value: "foods_with_kitchen",
    label: "調理企画（仕込場必要）",
    hasTopSpacer: false,
    badges: [
      { label: "食品取り扱い", allowed: true },
      { label: "調理", allowed: true },
      { label: "仕込場", allowed: true },
    ],
    icon: <FoodsWithKitchen width={40} height={40} />,
  },
  {
    value: "foods_without_kitchen",
    label: "調理企画（仕込場不要）",
    hasTopSpacer: false,
    badges: [
      { label: "食品取り扱い", allowed: true },
      { label: "調理", allowed: true },
      { label: "仕込場", allowed: false },
    ],
    icon: <FoodsWithoutKitchent width={40} height={40} />,
  },
  {
    value: "foods_without_cooking",
    label: "既製食品販売企画",
    hasTopSpacer: false,
    badges: [
      { label: "食品取り扱い", allowed: true },
      { label: "調理", allowed: false },
    ],
    icon: <FoodsWithoutCooking width={40} height={40} />,
  },
  {
    value: "stage_united",
    label: "ステージ企画",
    hasTopSpacer: true,
    badges: [],
    icon: <Stage width={40} height={40} />,
  },
];

export const RegisterForm = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm<RegisterProjectSchemaType>({
    mode: "onBlur",
    resolver: valibotResolver(RegisterProjectSchema),
  });

  const selectedCategory = useWatch({ control, name: "category" });
  const categoryType = category_to_type(selectedCategory);
  const selectedPlace = useWatch({ control, name: "place" });
  switch (categoryType) {
    case "general":
      if (selectedPlace === "stage") {
        resetField("place");
      }
      break;
    case "stage":
      if (selectedPlace !== "stage") {
        setValue("place", "stage");
      }
      break;
    case "none":
      // do nothing
      break;
  }

  const onSubmit = async (data: RegisterProjectSchemaType) => {
    let attributes: components["schemas"]["ProjectAttribute"][] = [];
    switch (data.place) {
      case "outside":
        attributes.push("outside");
        break;
      case "inside":
        attributes.push("inside");
        break;
      case "stage":
        attributes.push("outside");
        break;
    }
    toast.promise(
      client
        .POST("/projects", {
          body: {
            title: data.title,
            kana_title: data.kana_title,
            group_name: data.group_name,
            kana_group_name: data.kana_group_name,
            category: data.category as components["schemas"]["ProjectCategory"],
            attributes: attributes,
          },
        })
        .then(({ error }) => {
          if (error) {
            throw error;
          }
          router.push("/dashboard");
        })
        .catch(() => {
          throw new Error(`企画応募中にエラーが発生しました`);
        }),
      {
        loading: "企画応募中",
        success: "企画応募に成功しました",
        error: "企画応募中にエラーが発生しました",
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={stack({
        gap: 8,
        maxWidth: "100%",
      })}>
      <TextField
        type="text"
        id="title"
        label="企画名"
        placeholder="２０文字以内で入力"
        description="※絵文字不可。半角全角英数字・半角記号は３字で仮名２文字にカウントします。"
        register={register("title")}
        error={errors.title?.message}
      />
      <TextField
        type="text"
        id="kana_title"
        label="企画名（ふりがな）"
        register={register("kana_title")}
        error={errors.kana_title?.message}
      />
      <TextField
        type="text"
        id="group_name"
        label="企画団体名"
        placeholder="２０文字以内で入力"
        description="※絵文字不可。半角全角英数字・半角記号は３字で仮名２文字にカウントします。"
        register={register("group_name")}
        error={errors.group_name?.message}
      />
      <TextField
        type="text"
        id="kana_group_name"
        label="企画団体名（ふりがな）"
        register={register("kana_group_name")}
        error={errors.kana_group_name?.message}
      />
      <CategoryField items={categoryItems} register={register("category")} error={errors.category?.message} />
      <PlaceField categoryType={categoryType} register={register("place")} error={errors.place?.message} />
      <SingleCheckboxField
        id="agreement1"
        label="あなたは、別の企画団体の企画責任者または副企画責任者になることはできません。"
        register={register("agreement1")}
        error={errors.agreement1?.message}
      />
      <SingleCheckboxField
        id="agreement2"
        label="ここで回答した内容(企画区分・企画実施場所・企画名・企画団体名)の修正・変更は簡単に行うことができません。 "
        register={register("agreement2")}
        error={errors.agreement2?.message}
      />
      <Button type="submit" color="purple" className={css({ flexGrow: 0, alignSelf: "center" })}>
        送信
      </Button>
    </form>
  );
};
