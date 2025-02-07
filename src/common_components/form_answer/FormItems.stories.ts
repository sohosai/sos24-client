import { Meta, StoryObj } from "@storybook/react";
import { FormItems } from "./FormItems";
import { fn } from "@storybook/test";
import { testFormItems } from "@/helpers/forms";

const meta: Meta = {
  component: FormItems,
};

export default meta;

type Story = StoryObj<typeof FormItems>;

export const Default: Story = {
  args: {
    getValues: fn(),
    setValue: fn(),
    register: fn(),
    setFiles: fn(),
    setFileErrors: fn(),
    files: new Map(),
    errors: {},
    items: testFormItems,
  },
};
