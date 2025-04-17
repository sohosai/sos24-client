import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import ProjectTypeSelector from "./ProjectTypeSelector";

const meta: Meta<typeof ProjectTypeSelector> = {
  component: ProjectTypeSelector,
  argTypes: {
    onChange: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectTypeSelector>;

export const Default: Story = {
  args: {
    value: {
      location: [],
      food: [],
      committee: [],
      attributes: [],
    },
    onChange: action("clicked"),
  },
};

export const Selected: Story = {
  args: {
    value: {
      location: [],
      food: [],
      committee: ["委員会でない"],
      attributes: [],
    },
    onChange: action("clicked"),
  },
};
