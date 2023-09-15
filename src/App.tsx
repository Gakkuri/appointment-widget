import { useState, useEffect } from "react";
import * as z from "zod";
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
import Contact, { formSchema } from "./components/request-form/contact";

import { axiosRequest } from "./lib/axios-request";
import dayjs from "dayjs";

export type TypeService = {
  id: number;
  name: string;
  description: string;
  cost: number;
  time: number;
};

export type TypeLocation = {
  id: number;
  name: string;
  address: string;
  timezone: string;
  virtual: boolean;
};

export type Request = {
  service?: TypeService;
  location?: TypeLocation;
  date?: string;
  time?: string;
  client?: string;
};

export type RequestFormProps = {
  onChangePage: (addition: number) => void;
  requestValues: [
    Request | undefined,
    React.Dispatch<React.SetStateAction<Request | undefined>>
  ];
};

export interface RequestWithSubmit extends RequestFormProps {
  onPayment: (values: z.infer<typeof formSchema>) => void;
  onSignature: (values: z.infer<typeof formSchema>) => void;
}

type Steps = {
  key: string;
  label: string;
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

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    if (searchParams.get("widgetCheckoutDone")) {
      axiosRequest("put", `api/appointments`, {
        data: { id: searchParams.get("appointmentID") },
      });
    }
  }, []);

  const onChangePage = (addition: number) => {
    setCurrentPage((current) => current + addition);
  };

  const onPayment = async (values: z.infer<typeof formSchema>) => {
    // const compiledValues = { ...requestValues, clients: values };

    const { data: userData } = await axiosRequest(
      "post",
      "api/users/patients",
      {
        data: {
          name: `${values.you.first_name} ${values.you.last_name}`,
          email: values.you.email,
          address: values.you.address,
          phone: values.you.phone,
        },
      }
    );

    const { data: resData } = await axiosRequest("post", "api/appointments", {
      data: {
        location_id: requestValues?.location?.id,
        service_id: requestValues?.service?.id,
        date: requestValues?.date,
        time: requestValues?.time,
        minutes: requestValues?.service?.time,
        provider: null,
        patient: userData?.[0]?.id,
      },
    });

    const appointmentID = resData[0].id;
    const redirect = `${window.location.href}?widgetCheckoutDone=true&appointmentID=${appointmentID}`;
    const payerValue = values.you;
    const { data } = await axiosRequest("post", "api/checkout", {
      data: {
        redirect,
        email: payerValue.email,
      },
    });

    window.location.href = data.url;
  };

  // const onGetConsent = async () => {
  //   const { data } = await axios.get(
  //     // `https://simple-backend-pi.vercel.app/api/request-auth?redirect=${window.location.href}`
  //     `http://localhost:3000/api/request-auth?redirect=${window.location.href}`
  //   );

  //   window.open(data.auth);
  // };

  const onSignature = async (values: z.infer<typeof formSchema>) => {
    const { data } = await axiosRequest(
      "get",
      `api/signature?redirect=${window.location.href}&signerEmail=${values.you.email}&signerName=${values.you.first_name} ${values.you.last_name}`
    );

    console.log(data);
    alert("Document successfully sent to your email!");
  };

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
            onPayment={onPayment}
            onSignature={onSignature}
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
        {/* <Button onClick={onGetConsent}>Get Consent</Button>
        <Button onClick={onSignature}>Signature</Button> */}
        <DialogHeader>
          <DialogTitle>Request an appointment</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex">
          {/* Left Pane */}
          <div id="steps" className="flex flex-col grow-0 shrink-0 basis-1/4">
            {steps.map((step: Steps, i) => {
              return (
                <Step
                  onClick={() => i <= currentPage && setCurrentPage(--i)}
                  key={step.key + i}
                  step={++i}
                  label={step.label}
                  isFinished={i <= currentPage}
                  value={
                    step.key === "datetime"
                      ? dayjs(
                          `${dayjs(requestValues?.date).format("L")} ${
                            requestValues?.time
                          }`,
                          "MM/DD/YYYY HH:mm:ss"
                        ).format("L LT")
                      : requestValues?.[step.key]?.name ||
                        requestValues?.[step.key]
                  }
                />
              );
            })}
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
