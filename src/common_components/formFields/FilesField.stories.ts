import { Meta, StoryObj } from "@storybook/react";

import { FilesField } from "./FilesField";
import { fn } from "@storybook/test";

const meta: Meta = {
  component: FilesField,
};

export default meta;

type Story = StoryObj<typeof FilesField>;

export const Default: Story = {
  args: {
    id: "file",
    label: "ファイル",
    required: false,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "file",
    },
    setFiles: fn(),
    files: new Map(),
  },
};

export const Required: Story = {
  args: {
    id: "file",
    label: "ファイル",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "file",
    },
    setFiles: fn(),
    files: new Map(),
  },
};

export const Error: Story = {
  args: {
    id: "file",
    label: "ファイル",
    required: true,
    register: {
      ref: fn(),
      onChange: fn(),
      onBlur: fn(),
      name: "file",
    },
    setFiles: fn(),
    files: new Map(),
    error: "エラーが発生しました",
  },
};

// TODO: Fileを持つ場合のStoryを追加する
