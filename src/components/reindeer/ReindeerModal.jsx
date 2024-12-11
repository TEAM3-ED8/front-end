import * as React from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import santahat from "@/assets/santahat.webp";

export default function ReindeerModal({
  isOpen,
  isClose,
  onSubmit,
  data: initialData,
}) {
  const defaultValues = initialData || {
    name: "",
    type: "",
    skills: [
      { skill: "Speed", value: 0 },
      { skill: "Stamina", value: 0 },
      { skill: "Maneuverability", value: 0 },
      { skill: "Night vision", value: 0 },
      { skill: "Strength", value: 0 },
      { skill: "Climate adaptability", value: 0 },
      { skill: "Teamwork", value: 0 },
      { skill: "Navigation intelligence", value: 0 },
    ],
    available: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const onSubmitForm = handleSubmit((data) => {
    const formattedData = {
      ...data,
      skills: data.skills.map((skill) => ({
        skill: skill.skill,
        value: parseInt(skill.value, 10),
      })),
    };
    onSubmit(formattedData);
    isClose();
    reset();
  });

  return (
    <Dialog open={isOpen} onOpenChange={isClose}>
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-b from-red-100 to-green-100">
        <DialogHeader className="text-start mb-4">
          <DialogTitle className="text-2xl font-bold text-red-600 relative inline-block">
            {initialData ? "Edit reindeer" : "+ New reindeer"}
            <img
              src={santahat}
              alt="Santa hat"
              className="absolute -top-11 -left-2 w-12 h-12"
              aria-hidden="true"
            />
          </DialogTitle>
          <DialogDescription className="text-green-700">
            {initialData
              ? "Edit the details of the reindeer"
              : "Add a new reindeer to Santa's workshop"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmitForm} className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Label
              htmlFor="name"
              className="text-center text-zinc-500 col-span-1 w-1/4"
            >
              Name
            </Label>
            <div className="col-span-1 w-full">
              <Input
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Z]/,
                    message: "First letter must be capital",
                  },
                })}
                className="w-full border border-red-400 rounded-md px-3 py-2"
              />
              {errors.name && (
                <p role="alert" className="text-xs font-bold text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-4">
            <Label htmlFor="type" className="text-center text-zinc-500 w-1/4">
              Type
            </Label>
            <div className="col-span-1 w-full">
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border border-red-400 rounded-md px-3 py-2 bg-transparent">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        <SelectItem value="trainee">Trainee</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.type.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-zinc-500 text-center block mb-2">
              Skills
            </Label>
            <ScrollArea className="h-28 sm:h-1/2 rounded-md border p-2 box-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {defaultValues.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4"
                  >
                    <Label className="w-1/2 text-sm text-gray-700">
                      {skill.skill}
                    </Label>
                    <Input
                      type="number"
                      {...register(`skills.${index}.value`, {
                        valueAsNumber: true,
                        min: 0,
                        max: 10,
                      })}
                      placeholder="0-10"
                      min="0"
                      max="10"
                      className="w-20 text-center border border-red-400 rounded"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              {initialData ? "Save reindeer" : "Add reindeer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

ReindeerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        skill: PropTypes.string,
        value: PropTypes.number,
      })
    ),
  }),
};
