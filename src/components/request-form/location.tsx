import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RequestFormProps, TypeLocation } from "@/App";
import { axiosRequest } from "@/lib/axios-request";
import { useState } from "react";
import { useQuery } from "react-query";

const Location = ({ onChangePage, requestValues }: RequestFormProps) => {
  const [values, setValues] = requestValues;
  const [locations, setLocations] = useState<TypeLocation[]>([]);

  const { isLoading, error } = useQuery<TypeLocation[]>(
    "locations",
    () => {
      return axiosRequest("get", "api/locations").then((res) => res.data);
    },
    { onSuccess: setLocations }
  );
  const onSelect = (location: TypeLocation) => {
    setValues({
      ...values,
      location,
    });
    onChangePage(1);
  };

  return (
    <div className="flex flex-wrap items-stretch justify-evenly">
      {locations.map((location) => (
        <Card className="m-2" key={location.id}>
          <CardHeader>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription>{location.address}</CardDescription>
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

export default Location;
