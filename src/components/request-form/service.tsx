import { useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { RequestFormProps } from "@/App";
import { axiosRequest } from "@/lib/axios-request";
import { TypeService } from "@/App";

const Service = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [values, setValues] = requestValues;
  const [services, setServices] = useState<TypeService[]>([]);

  const { isLoading, error } = useQuery<TypeService[]>(
    "services",
    () => {
      return axiosRequest("get", "1/services").then((res) => res.data);
    },
    { onSuccess: setServices }
  );

  console.log(services);
  const onSelect = (service: TypeService) => {
    setValues({
      ...values,
      service,
    });
    onChangePage(1);
  };

  return (
    <div className="flex flex-col w-full">
      {services.map((service) => (
        <Card
          className="flex justify-between items-center my-2"
          key={service.id}
        >
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{`${service.time} minutes`}</CardDescription>
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
