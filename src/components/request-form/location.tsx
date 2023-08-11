import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RequestFormProps } from "@/App";

const LocationList = [
  {
    label: "Location 1",
    description: "",
  },
  {
    label: "Location 2",
    description: "",
  },
  {
    label: "Location 3",
    timdescriptione: "",
  },
  {
    label: "Location 4",
    description: "",
  },
  {
    label: "Location 5",
    description: "",
  },
  {
    label: "Location 6",
    timdescriptione: "",
  },
];

const Service = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [values, setValues] = requestValues;
  const onSelect = (location: { label?: string; description?: string }) => {
    setValues({
      ...values,
      location: location.label,
    });
    onChangePage(1);
  };

  return (
    <div className="flex flex-wrap items-stretch justify-evenly">
      {LocationList.map((location) => (
        <Card className="m-2" key={location.label}>
          <CardHeader>
            <CardTitle>{location.label}</CardTitle>
            <CardDescription>{location.description}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter>
            <Button onClick={() => onSelect(location)}>Select</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Service;
