import { Meta, StoryObj } from "@storybook/react";

import { NumberField } from "./NumberField";
import { fn } from "@storybook/test";

const meta: Meta = {
  component: NumberField,
};

export default meta;

type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  args: {
    id: "number",
    label: "数値",
    required: false,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "number",
    },
  },
};

export const Required: Story = {
  args: {
    id: "number",
    label: "数値",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "number",
    },
  },
};

export const Error: Story = {
  args: {
    id: "number",
    label: "数値",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "number",
    },
    error: "エラーが発生しました",
  },
};

export const Placeholder: Story = {
  args: {
    id: "number",
    label: "数値",
    placeholder: "入力してください",
    required: false,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "number",
    },
  },
};
