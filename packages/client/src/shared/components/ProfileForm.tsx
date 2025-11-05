import { format } from "date-fns";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { profileFormSchema, type ProfileFormValues } from "../utilities/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      gender: "",
      meditationExperience: "",
      dateOfBirth: undefined,
    },
  });

  function onSubmit(values: ProfileFormValues) {
    console.log("Form submitted:", values);
  }

  const inputStyle =
    "border-0 border-b-2 border-gray-200 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-b-blue-500";

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 space-y-8">
        <div className="flex flex-col items-center space-y-4 pt-8">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-green-100 text-green-700">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-gray-500 text-sm">
                    Display name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="displayName"
                      placeholder="Enter text..."
                      className={inputStyle}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel className="text-gray-500 text-sm">
                    Date of birth
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"secondary"}
                          className="w-auto justify-start text-left font-normal px-4 py-2 rounded-lg text-gray-900"
                        >
                          {field.value ? (
                            format(field.value, "d LLL yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={{ after: new Date() }}
                        autoFocus
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date(new Date().getFullYear(), 11)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-gray-500 text-sm">
                    Gender
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(inputStyle, "text-gray-900")}
                      >
                        <SelectValue placeholder="Select an option..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meditationExperience"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-gray-500 text-sm">
                    Meditation experience level
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(inputStyle, "text-gray-900")}
                      >
                        <SelectValue placeholder="Select an option..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-lg rounded-lg cursor-pointer"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
