import { Meta, StoryObj } from "@storybook/react";

import { CategoryBadges } from "@/common_components/CategoryBadges";

const meta: Meta = {
  component: CategoryBadges,
};

export default meta;

type Story = StoryObj<typeof CategoryBadges>;

export const Default: Story = {
  args: {
    categories: ["general"],
  },
};

export const MultipleCategories: Story = {
  args: {
    categories: ["general", "stage_1a"],
  },
};

export const AllCategories: Story = {
  args: {
    categories: [
      "general",
      "stage_1a",
      "stage_united",
      "foods_with_kitchen",
      "foods_without_kitchen",
      "foods_without_cooking",
      "stage_university_hall",
    ],
  },
};
