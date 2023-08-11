import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestFormProps } from "@/App";

const ServicesList = [
  {
    label: "Service 1",
    time: "1 hour",
  },
  {
    label: "Service 2",
    time: "15 minutes",
  },
  {
    label: "Service 3",
    time: "5 minutes",
  },
];

const Service = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [values, setValues] = requestValues;
  const onSelect = (service: { label: string; time: string }) => {
    setValues({
      ...values,
      service: service.label,
    });
    onChangePage(1);
  };

  return (
    <div className="flex flex-col w-full">
      {ServicesList.map((service) => (
        <Card
          className="flex justify-between items-center my-2"
          key={service.label}
        >
          <CardHeader>
            <CardTitle>{service.label}</CardTitle>
            <CardDescription>{service.time}</CardDescription>
          </CardHeader>
          <CardFooter className="py-0">
            <Button onClick={() => onSelect(service)}>Select</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Service;
