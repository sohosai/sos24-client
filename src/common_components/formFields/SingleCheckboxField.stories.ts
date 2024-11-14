import { Meta, Story, StoryObj } from "@storybook/react";

import { SingleCheckboxField } from "./SingleCheckboxField";
import { fn } from "@storybook/test";

const meta: Meta = {
  component: SingleCheckboxField,
};

export default meta;

type Story = StoryObj<typeof SingleCheckboxField>;

export const Default: Story = {
  args: {
    id: "checkbox",
    label: "チェックボックス",
    required: false,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "checkbox",
    },
  },
};

export const Required: Story = {
  args: {
    id: "checkbox",
    label: "チェックボックス",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "checkbox",
    },
  },
};

export const Error: Story = {
  args: {
    id: "checkbox",
    label: "チェックボックス",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "checkbox",
    },
    error: "エラーが発生しました",
  },
};
