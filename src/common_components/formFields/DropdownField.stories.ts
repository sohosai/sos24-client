import { Meta, StoryObj } from "@storybook/react";

import { DropdownField } from "./DropdownField";
import { fn } from "@storybook/test";

const meta: Meta = {
  component: DropdownField,
};

export default meta;

type Story = StoryObj<typeof DropdownField>;

export const Default: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: () => {},
      name: "name",
    },
  },
};

export const Required: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: () => {},
      name: "name",
    },
    required: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: "ラベル",
    description: "説明",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: () => {},
      name: "name",
    },
  },
};

export const WithError: Story = {
  args: {
    label: "ラベル",
    options: ["選択肢1", "選択肢2", "選択肢3"],
    register: {
      onBlur: fn(),
      onChange: fn(),
      ref: () => {},
      name: "name",
    },
    error: "エラーです",
  },
};
