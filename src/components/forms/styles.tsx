import { css, cva } from "@styled-system/css";

export const basicFormStyle = cva({
  base: {
    width: "100%",
    display: "block",
    backgroundColor: "gray.100",
    padding: 2,

    borderRadius: "md",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "gray.400",
  },
  variants: {
    isInvalid: {
      true: {
        borderColor: "error",
      },
    },
  },
  defaultVariants: {
    isInvalid: false,
  },
});

export const basicFormLabelStyle = css({
  marginBlock: 2,
  fontSize: "lg",
  fontWeight: "bold",
  display: "block",
  width: "fit-content",
});

export const basicErrorMessageStyle = css({
  color: "error",
  fontSize: "sm",
});

export const checkboxFormStyle = css({
  appearance: "none",
  height: 7,
  width: 7,
  border: 3,
  borderRadius: "sm",
  borderStyle: "solid",
  borderColor: "gray.400",
  cursor: "pointer",

  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' width='18' height='12' viewBox='0 0 18 12'%3e%3cpath stroke='%23A59E9E' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M2 5.7L7.0541 10.5L16 2'/%3e%3c/svg%3e")`,
  backgroundRepeat: "no-repeat",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  _checked: {
    backgroundColor: "primary",
    borderColor: "primary",
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' width='18' height='12' viewBox='0 0 18 12'%3e%3cpath stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M2 5.7L7.0541 10.5L16 2'/%3e%3c/svg%3e")`,
  },
});
