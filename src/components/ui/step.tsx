import { Check } from "lucide-react";

type StepProps = {
  step: number;
  label: string;
  isFinished?: boolean;
  onClick: () => void;
};

const Step = ({ step, label, isFinished, onClick }: StepProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-row my-2 mx-4 items-center${
        isFinished && " cursor-pointer"
      }`}
    >
      <div
        className={`flex rounded-full w-[25px] h-[25px] p-1 items-center justify-center mr-1 ${
          isFinished ? "bg-slate-500" : "border-[1px]"
        }`}
      >
        {isFinished ? <Check color="white" size={21} /> : step}
      </div>
      <p className="">{label}</p>
    </div>
  );
};

export default Step;
