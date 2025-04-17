import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/nextjs";

const annotations = setProjectAnnotations([]);

beforeAll(annotations.beforeAll);
