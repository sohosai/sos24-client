import { Meta, StoryObj } from "@storybook/react";

import { ProjectCategoryFormatter } from "./ProjectCategoryFormatter";

const meta: Meta<typeof ProjectCategoryFormatter> = {
  component: ProjectCategoryFormatter,
};

export default meta;

type Story = StoryObj<typeof ProjectCategoryFormatter>;

export const Default: Story = {
  args: {
    category: "general",
  },
};

export const FoodsWithKitchen: Story = {
  args: {
    category: "foods_with_kitchen",
  },
};

export const FoodsWithoutKitchen: Story = {
  args: {
    category: "foods_without_kitchen",
  },
};

export const FoodsWithoutCooking: Story = {
  args: {
    category: "foods_without_cooking",
  },
};

export const Stage1A: Story = {
  args: {
    category: "stage_1a",
  },
};

export const StageUnited: Story = {
  args: {
    category: "stage_united",
  },
};

export const StageUniversityHall: Story = {
  args: {
    category: "stage_university_hall",
  },
};
