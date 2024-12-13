import * as React from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import ReindeerComboBox from "@/components/reindeer/ReindeerComboBox";
import CustomCheckbox from "@/components/global/customCheckbox";
import santahat from "@/assets/santahat.webp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SantaSledge } from "@/components/global/iconsChristmas";
// import { fetchWeather } from "@/services/weather/weather";
import { useQuery } from "@tanstack/react-query";
export default function OrganizationModal({
  isOpen,
  isClose,
  onSubmit,
  data: { organizationData, reindeersData },
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
  const reindeerPositions = [
    { name: "1st", colStart: 3, rowStart: 2, position: 6 },
    { name: "2nd", colStart: 3, rowStart: 1, position: 5 },
    { name: "3rd", colStart: 2, rowStart: 2, position: 4 },
    { name: "4th", colStart: 2, rowStart: 1, position: 3 },
    { name: "5th", colStart: 1, rowStart: 2, position: 2 },
    { name: "6th", colStart: 1, rowStart: 1, position: 1 },
  ];

  const reindeersList = reindeersData.map((reindeer) => ({
    id: reindeer.id,
    name: reindeer.name,
    climateAdaptability: reindeer.climateAdaptability,
  }));

  const [selectedReindeers, setSelectedReindeers] = React.useState(
    positions.map((position) => position.reindeerId)
  );

  // const { data: weatherData } = useQuery({
  //   queryKey: ["weather"],
  //   queryFn: fetchWeather,
  //   staleTime: Infinity,
  // });

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

  const getBestReindeerForWeather = (weatherDescription, reindeers) => {
    const weatherConditions = {
      "partly cloudy": [
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
        "Prancer",
        "Vixen",
        "Rudolph",
      ],
      clear: [
        "Comet",
        "Cupid",
        "Dasher",
        "Dancer",
        "Donner",
        "Blitzen",
        "Prancer",
        "Vixen",
        "Rudolph",
      ],
      sunny: [
        "Donner",
        "Blitzen",
        "Comet",
        "Cupid",
        "Dasher",
        "Dancer",
        "Prancer",
        "Vixen",
        "Rudolph",
      ],
      "moderate rain": [
        "Prancer",
        "Vixen",
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
        "Rudolph",
      ],
      "patchy rain nearby": [
        "Rudolph",
        "Prancer",
        "Vixen",
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
      ],
      haze: [
        "Rudolph",
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
        "Prancer",
        "Vixen",
      ],
      "light rain shower": [
        "Prancer",
        "Vixen",
        "Rudolph",
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
      ],
      "light rain": [
        "Prancer",
        "Vixen",
        "Rudolph",
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
      ],
      overcast: [
        "Rudolph",
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
        "Prancer",
        "Vixen",
      ],
      mist: [
        "Rudolph",
        "Dasher",
        "Dancer",
        "Comet",
        "Cupid",
        "Donner",
        "Blitzen",
        "Prancer",
        "Vixen",
      ],
    };

    const bestReindeerNames = weatherConditions[
      weatherDescription.toLowerCase()
    ] || [
      "Rudolph",
      "Dasher",
      "Dancer",
      "Comet",
      "Cupid",
      "Donner",
      "Blitzen",
      "Prancer",
      "Vixen",
    ];

    // Sort reindeers and their climate adaptability
    return reindeers.sort((a, b) => {
      const aIndex = bestReindeerNames.indexOf(a.name);
      const bIndex = bestReindeerNames.indexOf(b.name);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return b.climateAdaptability - a.climateAdaptability;
    });
  };

  const handleReindeerChange = (index, selectedId) => {
    setSelectedReindeers((prev) => {
      const updated = [...prev];
      updated[index] = selectedId;

      if (document.getElementById("addBestReindeer").checked && weatherData) {
        const bestReindeer = getBestReindeerForWeather(
          weatherData.current.weather_descriptions[0],
          reindeersData
        );
        const availablePositions = [5, 4, 3, 2, 1, 0].filter(
          (i) => i !== index && !updated[i]
        );

        bestReindeer.forEach((reindeer) => {
          if (availablePositions.length > 0 && !updated.includes(reindeer.id)) {
            const positionIndex = availablePositions.shift();
            updated[positionIndex] = reindeer.id;
          }
        });
      }

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
    isClose();
    reset();
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={isClose}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-red-100 to-green-100">
          <DialogHeader className="text-start mb-4">
            <DialogTitle className="text-2xl font-bold text-red-600 relative inline-block">
              {organizationData ? "Edit organization" : "+ New organization"}
              <img
                src={santahat}
                alt="Santa hat"
                className="absolute -top-10 -left-6 w-12 h-12"
                aria-hidden="true"
              />
            </DialogTitle>
            <DialogDescription className="text-green-700">
              {organizationData
                ? "Edit the details of the organization"
                : "Add a new organization to Santa's workshop"}
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
            {/* <div className="flex items-center space-x-2 mt-4">
              <CustomCheckbox
                id="addBestReindeer"
                className="border-red-400"
                onCheckedChange={(checked) => {
                  if (checked && weatherData) {
                    const bestReindeer = getBestReindeerForWeather(
                      weatherData.current.weather_descriptions[0],
                      reindeersData
                    );
                    const updatedReindeers = Array(6).fill(null);
                    bestReindeer.forEach((reindeer, index) => {
                      if (index < 6) {
                        updatedReindeers[5 - index] = reindeer.id;
                      }
                    });
                    setSelectedReindeers(updatedReindeers);
                    updatedReindeers.forEach((reindeerId, index) => {
                      setValue(`positions.${index}.reindeerId`, reindeerId);
                    });
                  } else {
                    const emptyReindeers = Array(6).fill(null);
                    setSelectedReindeers(emptyReindeers);
                    emptyReindeers.forEach((_, index) => {
                      setValue(`positions.${index}.reindeerId`, null);
                    });
                  }
                }}
              />
              <Label
                htmlFor="addBestReindeer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-700"
              >
                Suggested best reindeer for December 25th.
              </Label>
            </div> */}
            <div className="flex flex-col gap-1">
              <Label className=" text-zinc-500">Organize your reindeer</Label>
              <CardDescription className="hidden min-[400px]:block">
                Assign reindeer to Santa&apos;s sleigh by clicking buttons to
                select from a menu of available options.
              </CardDescription>
              <div className="flex items-center justify-center p-3">
                <SantaSledge
                  className="hidden min-[450px]:block"
                  transform="scale(-1, 1)"
                  width={124}
                  height={124}
                />
                <div className="grid grid-cols-3 gap-1 place-items-center">
                  {reindeerPositions.map((position, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-2"
                        style={{
                          gridColumnStart: position.colStart,
                          gridRowStart: position.rowStart,
                        }}
                      >
                        <Badge
                          variant="outline"
                          className="bg-amber-900 text-white mx-auto"
                        >
                          {position.name}
                        </Badge>
                        <ReindeerComboBox
                          data={reindeersList.filter(
                            (reindeer) =>
                              !selectedReindeers.includes(reindeer.id) ||
                              selectedReindeers[5 - index] === reindeer.id
                          )}
                          value={selectedReindeers[5 - index]}
                          onChange={(value) =>
                            handleReindeerChange(5 - index, value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter className="w-full">
              <Button
                type="submit"
                className=" bg-green-600 hover:bg-green-700 w-full"
                disabled={isSubmitDisabled}
              >
                <Check /> Save
              </Button>
            </DialogFooter>
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
        climateAdaptability: PropTypes.number,
      })
    ).isRequired,
  }),
  generateOrganizationToView: PropTypes.func,
};
