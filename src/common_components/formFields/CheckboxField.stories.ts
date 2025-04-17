import { Meta, StoryObj } from "@storybook/react";

import { CheckboxField } from "./CheckboxField";
import { fn } from "@storybook/test";

const meta: Meta = {
  component: CheckboxField,
};

export default meta;

type Story = StoryObj<typeof CheckboxField>;

export const Default: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: fn(),
      name: "name",
    },
    getValues: fn(),
    setValue: fn(),
  },
};

export const Disabled: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: fn(),
      name: "name",
    },
    getValues: fn(),
    setValue: fn(),
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: fn(),
      name: "name",
    },
    getValues: fn(),
    setValue: fn(),
    error: "エラーが発生しました",
  },
};

export const WithDescription: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: fn(),
      name: "name",
    },
    getValues: fn(),
    setValue: fn(),
    description: "説明",
  },
};

export const Required: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: fn(),
      name: "name",
    },
    getValues: fn(),
    setValue: fn(),
    required: true,
  },
};
