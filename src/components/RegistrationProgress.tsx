import RegistrationProgress1 from "./assets/RegistrationProgress/1.svg";
import RegistrationProgress2 from "./assets/RegistrationProgress/2.svg";
import RegistrationProgress3 from "./assets/RegistrationProgress/3.svg";
import RegistrationProgress4 from "./assets/RegistrationProgress/4.svg";
import RegistrationProgress5 from "./assets/RegistrationProgress/5.svg";
import Image from "next/image";

interface RegistrationProgressProps {
  step: 1 | 2 | 3 | 4 | 5;
}

export const RegistrationProgress = ({ step }: RegistrationProgressProps) => {
  switch (step) {
    case 1:
      return <Image src={RegistrationProgress1} alt="Step 1" />;
    case 2:
      return <Image src={RegistrationProgress2} alt="Step 2" />;
    case 3:
      return <Image src={RegistrationProgress3} alt="Step 3" />;
    case 4:
      return <Image src={RegistrationProgress4} alt="Step 4" />;
    case 5:
      return <Image src={RegistrationProgress5} alt="Step 5" />;
  }
};