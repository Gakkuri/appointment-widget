import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RequestWithSubmit } from "@/App";
import { useState } from "react";

export const formSchema = z.object({
  you: z.object({
    first_name: z.string().min(2).max(50),
    last_name: z.string().min(2).max(50),
    phone: z.string().min(2).max(50),
    address: z.string(),
    email: z.string(),
  }),
  client: z
    .object({
      first_name: z.string().min(2).max(50),
      last_name: z.string().min(2).max(50),
      phone: z.string().min(2).max(50),
      address: z.string(),
      email: z.string(),
    })
    .optional(),
});

const Contact = ({
  requestValues,
  onPayment,
  onSignature,
}: RequestWithSubmit) => {
  const [rValues] = requestValues;
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    onPayment(values);

    // alert(`
    // Service: ${rValues?.service},
    // Location: ${rValues?.location},
    // Date & Time: ${rValues?.datetime},
    // Client: ${rValues?.client},
    // Information (You)
    //   First Name: ${values?.you?.first_name},
    //   Last Name: ${values?.you?.last_name},
    //   Email: ${values?.you?.email},
    //   Phone: ${values?.you?.phone},
    //   Date of Birth: ${values?.you?.birth_date},
    // Information (Client)
    //   First Name: ${values?.client?.first_name},
    //   Last Name: ${values?.client?.last_name},
    //   Email: ${values?.client?.email},
    //   Phone: ${values?.client?.phone},
    //   Date of Birth: ${values?.client?.birth_date},
    // `);
  };

  const onClickSignature = () => {
    // console.log(form.getValues());
    onSignature(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="font-bold text-lg">You</h1>
        <FormField
          control={form.control}
          name="you.first_name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="you.last_name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="you.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="you.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="you.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {rValues?.client !== "me" && (
          <>
            <h1 className="font-bold text-lg">Client</h1>
            <FormField
              control={form.control}
              name="client.first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="flex justify-between">
          <Button type="button" onClick={onClickSignature}>
            Send Document for Signature
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Contact;
