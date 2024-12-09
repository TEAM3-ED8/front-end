import * as React from "react";

import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import ReindeerComboBox from "@/components/reindeer/ReindeerComboBox";
import CustomCheckbox from "@/components/global/customCheckbox";
import santahat from "@/assets/santahat.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeInfo, Check } from "lucide-react";

export default function OrganizationModal({
  isOpen,
  isClose,
  onSubmit,
  data: { organizationData, reindeersData },
  generateOrganizationToView = () => {},
}) {
  const defaultValues = organizationData || {
    name: "",
    positions: Array.from({ length: 6 }, (_, i) => ({
      position: i + 1,
      reindeerId: null,
    })),
    isSelected: false,
    isAvailable: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const positions = watch("positions");

  const reindeersList = reindeersData.map((reindeer) => ({
    id: reindeer.id,
    name: reindeer.name,
  }));

  const [selectedReindeers, setSelectedReindeers] = React.useState(
    positions.map((position) => position.reindeerId)
  );

  React.useEffect(() => {
    if (organizationData) {
      reset(organizationData);
      setSelectedReindeers(
        organizationData.positions.map((position) => position.reindeerId)
      );
    } else {
      reset(defaultValues);
      setSelectedReindeers(
        defaultValues.positions.map((position) => position.reindeerId)
      );
    }
  }, [organizationData, reset]);

  React.useEffect(() => {
    if (isClose) {
      setSelectedReindeers(
        defaultValues.positions.map((position) => position.reindeerId)
      );
      reset(defaultValues);
    }
  }, [isClose, reset]);

  const handleReindeerChange = (index, selectedId) => {
    setSelectedReindeers((prev) => {
      const updated = [...prev];
      updated[index] = selectedId;

      updated.forEach((id, i) => {
        if (id === selectedId && i !== index) {
          updated[i] = null;
        }
      });

      return updated;
    });
    setValue(`positions.${index}.reindeerId`, selectedId);
  };

  const isSubmitDisabled = selectedReindeers.some(
    (reindeerId) => reindeerId === null
  );

  const onSubmitForm = handleSubmit((data) => {
    const allPositionsHaveReindeer = data.positions.every(
      (position) => position.reindeerId !== null
    );

    const formattedData = {
      ...data,
      isSelected: organizationData
        ? allPositionsHaveReindeer
          ? organizationData.isSelected
          : false
        : false,
      isAvailable: allPositionsHaveReindeer,
    };

    onSubmit(formattedData);
    generateOrganizationToView(allPositionsHaveReindeer ? formattedData : null);
    isClose();
    reset();
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={isClose}>
        <DialogContent className="sm:max-w-[450px] bg-gradient-to-b from-red-100 to-green-100">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-2xl font-bold text-red-600">
              <span className="relative">
                {organizationData ? "Edit organization" : "New organization"}
                <img
                  src={santahat}
                  alt="Santa hat"
                  className="absolute -top-11 -left-2 w-12 h-12"
                />
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-green-700">
              {organizationData
                ? "Edit the details of the organization"
                : "Add a new reindeer organization to Santa's workshop"}
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
              <div className="col-span-1 w-full h-max">
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
                  <p
                    role="alert"
                    className="text-xs font-bold text-red-500 mt-1"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <CustomCheckbox id="addBestReindeer" className="border-red-400" />
              <Label
                htmlFor="addBestReindeer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-700"
              >
                Suggested best reindeer for December 25th.
              </Label>
            </div>
            <Card className="bg-transparent">
              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle>Organize your reindeer</CardTitle>
                  <CardDescription>
                    Organize the reindeer for Santa&apos;s sleigh. Click each
                    button to assign a different reindeer to its position. When
                    you click a button, a menu will appear with a list of
                    available reindeer for easy selection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-5">
                    <p
                      className={`flex text-sm text-muted-foreground gap-2 items-center`}
                    >
                      <BadgeInfo size={16} />A reindeer cannot be in more than
                      one position
                    </p>
                    <div className="grid grid-cols-2 gap-5 place-items-center md:grid-cols-3">
                      {positions.map((_, index) => (
                        <ReindeerComboBox
                          key={index}
                          data={reindeersList.filter(
                            (reindeer) =>
                              !selectedReindeers.includes(reindeer.id) ||
                              selectedReindeers[index] === reindeer.id
                          )}
                          value={selectedReindeers[index]}
                          onChange={(value) =>
                            handleReindeerChange(index, value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <DialogFooter className="w-full">
                    <Button
                      type="submit"
                      className=" bg-green-600 hover:bg-green-700 w-full"
                      disabled={isSubmitDisabled}
                    >
                      <Check /> Save
                    </Button>
                  </DialogFooter>
                </CardFooter>
              </div>
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

OrganizationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({
    organizationData: PropTypes.shape({
      name: PropTypes.string,
      positions: PropTypes.arrayOf(
        PropTypes.shape({
          position: PropTypes.number,
          reindeerId: PropTypes.number,
        })
      ),
      isSelected: PropTypes.bool,
      isAvailable: PropTypes.bool,
    }),
    reindeersData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      })
    ).isRequired,
  }),
  generateOrganizationToView: PropTypes.func,
};
