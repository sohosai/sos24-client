import RegistrationProgress1 from "@/assets/RegistrationProgress/progress1.svg?url";
import RegistrationProgress2 from "@/assets/RegistrationProgress/progress2.svg?url";
import RegistrationProgress3 from "@/assets/RegistrationProgress/progress3.svg?url";
import RegistrationProgress4 from "@/assets/RegistrationProgress/progress4.svg?url";
import RegistrationProgress5 from "@/assets/RegistrationProgress/progress5.svg?url";
import RegistrationProgress6 from "@/assets/RegistrationProgress/progress6.svg?url";
import RegistrationProgress7 from "@/assets/RegistrationProgress/progress7.svg?url";
import RegistrationProgress8 from "@/assets/RegistrationProgress/progress8.svg?url";
import RegistrationProgress9 from "@/assets/RegistrationProgress/progress9.svg?url";
import Image from "next/image";
import { FC } from "react";

export const RegistrationProgress: FC<{
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
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
    case 6:
      return <Image src={RegistrationProgress6} alt="" />;
    case 7:
      return <Image src={RegistrationProgress7} alt="" />;
    case 8:
      return <Image src={RegistrationProgress8} alt="" />;
    case 9:
      return <Image src={RegistrationProgress9} alt="" />;
  }
};
