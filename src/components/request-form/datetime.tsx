import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { RequestFormProps } from "@/App";

type Time = {
  time: string;
  onClick: (time: string) => void;
};

const Time = ({ time, onClick }: Time) => (
  <div
    className="border-[1px] px-4 py-2 rounded-full cursor-pointer m-2"
    onClick={() => onClick(time)}
  >
    {time}
  </div>
);

const Datetime = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [values, setValues] = requestValues;

  const onSubmit = (time: string) => {
    setValues({
      ...values,
      datetime: {
        date,
        time,
      },
    });

    onChangePage(1);
  };

  return (
    <div className="flex">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border mr-8"
      />

      <div className="">
        <h1 className="font-bold">Select Time</h1>
        <Time time="7:00 am" onClick={onSubmit} />
        <Time time="7:30 am" onClick={onSubmit} />
        <Time time="8:00 am" onClick={onSubmit} />
        <Time time="8:30 am" onClick={onSubmit} />
        <Time time="9:00 am" onClick={onSubmit} />
      </div>
    </div>
  );
};

export default Datetime;
