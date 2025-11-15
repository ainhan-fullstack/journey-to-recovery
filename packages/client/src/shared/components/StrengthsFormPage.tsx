import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  strengthsFormSchema,
  type StrengthsFormValues,
} from "../utilities/schema";

export default function StrengthsFormPage() {
  const navigate = useNavigate();

  const form = useForm<StrengthsFormValues>({
    resolver: zodResolver(strengthsFormSchema),
    defaultValues: {
      values: "",
      goodAt: "",
      overcome: "",
      valuedFor: "",
    },
  });

  function onSubmit(data: StrengthsFormValues) {
    navigate("/strengths-summary", {
      state: {
        strengths: data,
      },
    });
  }

  return (
    <div className="flex justify-center bg-orange-50 min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md flex flex-col shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-6 flex flex-col flex-grow overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col flex-grow"
            >
              <FormField
                control={form.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-3xl font-bold text-blue-800">
                      What I value the most...
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text ..."
                        className="min-h-[120px] text-lg rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goodAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-3xl font-bold text-blue-800">
                      Things I am good at ...
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text ..."
                        className="min-h-[120px] text-lg rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-3xl font-bold text-blue-800">
                      Challenges I have overcome...
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text ..."
                        className="min-h-[120px] text-lg rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valuedFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-3xl font-bold text-blue-800">
                      What my friends/family value about me...
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text ..."
                        className="min-h-[120px] text-lg rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex-grow" />

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg"
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
