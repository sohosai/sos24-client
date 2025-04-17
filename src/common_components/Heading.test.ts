import { expect, test } from "vitest";
import { composeStories } from "@storybook/react";

import * as stories from "./Heading.stories";

const { Default } = composeStories(stories);

test("renders and executes the play function", async () => {
  await Default.run();
  expect(document.body.firstChild).toMatchSnapshot();
});
