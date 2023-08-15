import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestFormProps } from "@/App";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LocalizedFormat from "dayjs/plugin/LocalizedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(LocalizedFormat);
dayjs.tz.setDefault("America/Los_Angeles");

type Time = {
  time: string;
  onClick: (time: string) => void;
  value: string;
};

const Timezones = [
  {
    key: "America/Los_Angeles",
    label: "Pacific Time (US & Canada)",
  },
  {
    key: "Europe/London",
    label: "London",
  },
  {
    key: "Asia/Singapore",
    label: "Singapore",
  },
];

const Time = ({ time, onClick, value }: Time) => (
  <div
    className="border-[1px] px-4 py-2 rounded-full cursor-pointer m-2"
    onClick={() => onClick(value)}
  >
    {time}
  </div>
);

const Datetime = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(
    "America/Los_Angeles"
  );
  const [values, setValues] = requestValues;

  const onSubmit = (time: string) => {
    setValues({
      ...values,
      datetime: dayjs(
        `${dayjs(date).format("L")} ${time}`,
        "MM/DD/YYYY HH:mm:ss"
      ).format("L LT"),
    });

    onChangePage(1);
  };

  const formatTime = (time: string) => {
    return dayjs
      .tz(time, "HH:mm:ss", "America/Los_Angeles")
      .tz(selectedTimezone)
      .format("LT");
  };

  return (
    <div className="flex">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border mr-8"
      />

      <div className="mt-4">
        <Select
          value={selectedTimezone}
          onValueChange={(v) => setSelectedTimezone(v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Timezone" />
          </SelectTrigger>
          <SelectContent>
            {Timezones.map((tz: { key: string; label: string }) => (
              <SelectItem key={tz.key} value={tz.key}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <h1 className="font-bold mt-2">Select Time</h1>
        <Time
          time={formatTime("07:00:00")}
          value="07:00:00"
          onClick={onSubmit}
        />
        <Time
          time={formatTime("07:30:00")}
          value="07:30:00"
          onClick={onSubmit}
        />
        <Time
          time={formatTime("08:00:00")}
          value="08:00:00"
          onClick={onSubmit}
        />
        <Time
          time={formatTime("08:30:00")}
          value="08:30:00"
          onClick={onSubmit}
        />
        <Time
          time={formatTime("09:00:00")}
          value="09:00:00"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default Datetime;
