import RegistrationProgress1 from "@/assets/RegistrationProgress/1.svg?url";
import RegistrationProgress2 from "@/assets/RegistrationProgress/2.svg?url";
import RegistrationProgress3 from "@/assets/RegistrationProgress/3.svg?url";
import RegistrationProgress4 from "@/assets/RegistrationProgress/4.svg?url";
import RegistrationProgress5 from "@/assets/RegistrationProgress/5.svg?url";
import Image from "next/image";
import { FC } from "react";

export const RegistrationProgress: FC<{
  step: 1 | 2 | 3 | 4 | 5;
}> = ({ step }) => {
  switch (step) {
    case 1:
      return <Image src={RegistrationProgress1} alt="" />;
    case 2:
      return <Image src={RegistrationProgress2} alt="" />;
    case 3:
      return <Image src={RegistrationProgress3} alt="" />;
    case 4:
      return <Image src={RegistrationProgress4} alt="" />;
    case 5:
      return <Image src={RegistrationProgress5} alt="" />;
  }
};
