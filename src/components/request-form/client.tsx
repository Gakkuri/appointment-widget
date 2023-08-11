import { useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { RequestFormProps } from "@/App";

const Client = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [client, setClient] = useState("");
  const [values, setValues] = requestValues;

  const onChange = (value: string) => setClient(value);
  const onNext = () => {
    setValues({
      ...values,
      client,
    });
    onChangePage(1);
  };

  return (
    <div>
      <h1>Who os this appointment for?</h1>
      <p>
        You can request this appointment for yourself or on behalf of someone
        else. Please choose below.
      </p>
      <RadioGroup className="my-4" onValueChange={onChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="me" id="me" />
          <Label htmlFor="option-one">Me</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="someone else" id="someone-else" />
          <Label htmlFor="option-two">Someone else</Label>
        </div>
      </RadioGroup>
      <Button disabled={!client} onClick={onNext}>
        Next
      </Button>
    </div>
  );
};

export default Client;
