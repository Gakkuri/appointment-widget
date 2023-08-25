import { useState, useEffect } from "react";
import axios from "axios";
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
    if (searchParams.get("widgetCheckoutDone")) alert("Payment Successful!");
  }, []);

  const onChangePage = (addition: number) => {
    setCurrentPage((current) => current + addition);
  };

  const onPayment = async (values: z.infer<typeof formSchema>) => {
    const redirectUrl = `${window.location.href}?widgetCheckoutDone=true`;
    const payerValue = values.you;
    const { data } = await axios.get(
      `https://simple-backend-pi.vercel.app/api/checkout?redirect=${redirectUrl}&email=${payerValue.email}`
      // `http://localhost:3000/api/checkout?redirect=${redirectUrl}&email=${payerValue.email}&phone=${payerValue.phone}`
    );
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
    const { data } = await axios.get(
      `https://simple-backend-pi.vercel.app/api/signature?redirect=${window.location.href}&signerEmail=${values.you.email}&signerName=${values.you.first_name} ${values.you.last_name}`
      // `http://localhost:3000/api/signature?redirect=${window.location.href}&signerEmail=${values.you.email}&signerName=${values.you.first_name} ${values.you.last_name}`
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
                  value={requestValues?.[step.key]}
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
