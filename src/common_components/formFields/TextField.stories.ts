import { Meta, StoryObj } from "@storybook/react";
import { TextField } from "./TextField";
import { fn } from "@storybook/test";

const meta: Meta = {
  component: TextField,
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Text: Story = {
  args: {
    id: "text",
    label: "テキスト",
    type: "text",
    required: false,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "text",
    },
  },
};

export const TextArea: Story = {
  args: {
    id: "textarea",
    label: "テキストエリア",
    type: "textarea",
    required: false,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "textarea",
    },
  },
};

export const Required: Story = {
  args: {
    id: "text",
    label: "テキスト",
    type: "text",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "text",
    },
  },
};

export const Error: Story = {
  args: {
    id: "text",
    label: "テキスト",
    type: "text",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "text",
    },
    error: "エラーが発生しました",
  },
};
