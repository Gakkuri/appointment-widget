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
import isBetween from "dayjs/plugin/isBetween";
import { axiosRequest } from "@/lib/axios-request";
import { useQuery } from "react-query";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(LocalizedFormat);
dayjs.extend(isBetween);
dayjs.tz.setDefault("America/Los_Angeles");

type Time = {
  time: string;
  onClick: (time: string) => void;
  value: string;
  disabled: boolean;
};

type Appointment = {
  id: number;
  service_id: number | string;
  location_id: number | string;
  date: Date | string;
  time: string;
  minutes: number;
  provider: string;
  patient: string;
};

type Availability = {
  id: number;
  service_id: number | string;
  location_id: number | string;
  provider: number | string;
  title: string;
  start_date: Date | string;
  end_date?: Date | string;
  start_time: string;
  end_time: string;
  repeat?: boolean;
  days?: string[];
  allow_virtual?: boolean;
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

const Time = ({ time, onClick, value, disabled }: Time) => (
  <div
    className={`border-[1px] px-4 py-2 rounded-full m-2 ${
      disabled ? "cursor-not-allowed bg-neutral-300" : "cursor-pointer"
    }`}
    onClick={() => (disabled ? null : onClick(value))}
  >
    {time}
  </div>
);

const Datetime = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState(
    "America/Los_Angeles"
  );

  const serviceId = requestValues[0]?.service?.id;
  const locationId = requestValues[0]?.location?.id;

  const { isLoading: appointmentLoading, error: appointmentError } = useQuery<
    Appointment[]
  >(
    "appointments",
    () => {
      return axiosRequest("get", "1/appointments").then((res) => res.data);
    },
    {
      onSuccess: (v) => {
        setAppointments(
          v.filter(
            (appointment) =>
              appointment.service_id === serviceId &&
              appointment.location_id === locationId
          )
        );
      },
    }
  );

  const {
    isLoading: availabilityLoading,
    error: availabilityError,
    refetch,
  } = useQuery<Availability[]>(
    ["availabilities"],
    () => {
      return axiosRequest("get", "1/availabilities").then((res) => res.data);
    },
    {
      onSuccess: (v) => {
        setAvailabilities(
          v.filter(
            (appointment) =>
              appointment.service_id === serviceId &&
              appointment.location_id === locationId
          )
        );
      },
    }
  );

  const [values, setValues] = requestValues;

  const onSubmit = (time: string) => {
    setValues({
      ...values,
      date: dayjs(date).format("L"),
      time,
    });

    onChangePage(1);
  };

  const filterDates = (selected: Date | undefined, current: Availability) => {
    const day = dayjs(selected).format("dddd");
    if (!current.days?.includes(day)) return true;
    if (dayjs(selected).isBefore(dayjs(current.start_date))) return true;
    if (current.end_date) {
      if (dayjs(selected).isAfter(dayjs(current.end_date))) return true;
    }
    return false;
  };

  const filterTimes = (time: string, start: string, end: string) => {
    return dayjs(time, "HH:mm:ss").isBetween(
      dayjs(start, "HH:mm:ss"),
      dayjs(end, "HH:mm:ss"),
      null,
      "[]"
    );
  };

  const disableCalendarDates = (d: Date) => {
    return availabilities.every((availability) => filterDates(d, availability));
  };

  const isAvailable = (time: string) => {
    const endTime = dayjs(time, "HH:mm:ss")
      .add(values?.service?.time || 0, "minutes")
      .subtract(1, "second")
      .format("HH:mm:ss");

    const filteredAvailability = availabilities.filter(
      (availability) => !filterDates(date, availability)
    );

    const filteredAppointments = appointments.filter((appointment) =>
      dayjs(appointment.date).isSame(dayjs(date).startOf("d"))
    );

    // const availabilityResult = filteredAvailability.some((availability) => {
    //   if (
    //     dayjs(time, "HH:mm:ss").isBefore(
    //       dayjs(availability.start_time, "HH:mm:ss")
    //     )
    //   ) {
    //     return false;
    //   }

    //   if (
    //     dayjs(endTime, "HH:mm:ss").isAfter(
    //       dayjs(availability.end_time, "HH:mm:ss")
    //     )
    //   ) {
    //     return false;
    //   }

    //   return true;
    // });

    const availabilityResult = filteredAvailability.filter((availability) => {
      if (
        dayjs(time, "HH:mm:ss").isBefore(
          dayjs(availability.start_time, "HH:mm:ss")
        )
      ) {
        return false;
      }

      if (
        dayjs(endTime, "HH:mm:ss").isAfter(
          dayjs(availability.end_time, "HH:mm:ss")
        )
      ) {
        return false;
      }

      return true;
    });

    // const appointmentResult = filteredAppointments.every((appointment) => {
    //   const appointmentEnd = dayjs(appointment.time, "HH:mm:ss")
    //     .add(appointment.minutes || 0, "minutes")
    //     .subtract(1, "second")
    //     .format("HH:mm:ss");

    //   return (
    //     filterTimes(time, appointment.time, appointmentEnd) &&
    //     filterTimes(endTime, appointment.time, appointmentEnd)
    //   );
    // });

    const appointmentResult = filteredAppointments.filter((appointment) => {
      const appointmentEnd = dayjs(appointment.time, "HH:mm:ss")
        .add(appointment.minutes || 0, "minutes")
        .subtract(1, "second")
        .format("HH:mm:ss");

      return (
        filterTimes(time, appointment.time, appointmentEnd) ||
        filterTimes(endTime, appointment.time, appointmentEnd)
      );
    });

    // return availabilityResult && appointmentResult;
    return availabilityResult.length > appointmentResult.length;
  };

  const formatTime = (time: string) => {
    return dayjs
      .tz(time, "HH:mm:ss", "America/Los_Angeles")
      .tz(selectedTimezone)
      .format("LT");
  };

  if (appointmentLoading || availabilityLoading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={disableCalendarDates}
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
          disabled={!isAvailable("07:00:00")}
        />
        <Time
          time={formatTime("07:30:00")}
          value="07:30:00"
          onClick={onSubmit}
          disabled={!isAvailable("07:30:00")}
        />
        <Time
          time={formatTime("08:00:00")}
          value="08:00:00"
          onClick={onSubmit}
          disabled={!isAvailable("08:00:00")}
        />
        <Time
          time={formatTime("08:30:00")}
          value="08:30:00"
          onClick={onSubmit}
          disabled={!isAvailable("08:30:00")}
        />
        <Time
          time={formatTime("09:00:00")}
          value="09:00:00"
          onClick={onSubmit}
          disabled={!isAvailable("09:00:00")}
        />
      </div>
    </div>
  );
};

export default Datetime;
