import { useState } from "react";
import "./App.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Step from "./components/ui/step";
import Service from "./components/request-form/service";
import Location from "./components/request-form/location";
import Datetime from "./components/request-form/datetime";
import Client from "./components/request-form/client";
import Contact from "./components/request-form/contact";

export type Request = {
  service?: string;
  location?: string;
  datetime?: string;
  client?: string;
};

export type RequestFormProps = {
  onChangePage: (addition: number) => void;
  requestValues: [
    Request | undefined,
    React.Dispatch<React.SetStateAction<Request | undefined>>
  ];
};

const steps = [
  {
    key: "service",
    label: "Service",
  },
  {
    key: "location",
    label: "Select Location",
  },
  {
    key: "datetime",
    label: "Select Date & Time",
  },
  {
    key: "client",
    label: "Select Client",
  },
  {
    key: "service",
    label: "Contact Information",
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [requestValues, setRequestValues] = useState<Request | undefined>();

  // console.log(requestValues);

  const onChangePage = (addition: number) => {
    setCurrentPage((current) => current + addition);
  };

  // const onSubmit = () => {
  //   console.log("test");
  // };

  const Pages = () => {
    switch (currentPage) {
      // Page 0
      case 0:
        return (
          <Service
            onChangePage={onChangePage}
            requestValues={[requestValues, setRequestValues]}
          />
        );
      // Page 1
      case 1:
        return (
          <Location
            onChangePage={onChangePage}
            requestValues={[requestValues, setRequestValues]}
          />
        );
      // Page 2
      case 2:
        return (
          <Datetime
            onChangePage={onChangePage}
            requestValues={[requestValues, setRequestValues]}
          />
        );
      // Page 3
      case 3:
        return (
          <Client
            onChangePage={onChangePage}
            requestValues={[requestValues, setRequestValues]}
          />
        );
      // Page 4
      case 4:
        return (
          <Contact
            onChangePage={onChangePage}
            requestValues={[requestValues, setRequestValues]}
          />
        );

      default:
        return <p>Nothing Here</p>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="fixed bottom-10 right-10 bg-slate-600 py-2 px-4 text-white rounded-full">
        Appointment
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Request an appointment</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex">
          {/* Left Pane */}
          <div id="steps" className="flex flex-col grow-0 shrink-0 basis-1/4">
            {steps.map((step, i) => (
              <Step
                onClick={() => i <= currentPage && setCurrentPage(--i)}
                key={step.key + i}
                step={++i}
                label={step.label}
                isFinished={i <= currentPage}
                value={requestValues?.[step.key] || ""}
              />
            ))}
          </div>
          {/* Right Pane */}
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div id="content" className="flex flex-col grow-0 basis-3/4">
              <div>{Pages()}</div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default App;
