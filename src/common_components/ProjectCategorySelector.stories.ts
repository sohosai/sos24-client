import { Meta, StoryObj } from "@storybook/react";
import { ProjectCategorySelector } from "./ProjectCategorySelector";
import { fn } from "@storybook/test";

const meta: Meta<typeof ProjectCategorySelector> = {
  component: ProjectCategorySelector,
};

export default meta;

type Story = StoryObj<typeof ProjectCategorySelector>;

export const Default: Story = {
  args: {
    register: {
      ref: fn(),
      name: "projectCategory",
      onChange: fn(),
      onBlur: fn(),
    },
  },
};

export const Error: Story = {
  args: {
    error: "エラーが発生しました",
  },
};
