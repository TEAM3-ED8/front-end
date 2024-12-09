import * as React from "react";

import { ModalContext } from "@/components/reindeer/OrganizationManager";
import {
  useDeleteReindeer,
  useDeleteCheckedReindeer,
} from "@/services/reindeer/reindeerapi";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomCheckbox from "@/components/global/customCheckbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, PlusSquare, Eye } from "lucide-react";
import { ReindeerIcon } from "@/components/global/iconsChristmas";
import SelectAll from "@/components/global/selectAll";

export default function ReindeerList({
  data: { organizationsData, reindeersData },
  generateOrganizationToView = () => {},
}) {
  // Use the context to access the state and its updater function
  const { setModalState } = React.useContext(ModalContext);

  const toast = useToast();

  const [checkedReindeer, setChecketReindeer] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  // Mutations for deleting reindeer data.
  const deleteReindeerMutation = useDeleteReindeer();
  const deleteCheckedReindeer = useDeleteCheckedReindeer();

  // Function to handle deleting a reindeer
  const handleDeleteReindeer = async (reindeerDeleted) => {
    try {
      await deleteReindeerMutation.mutateAsync(reindeerDeleted);
      toast.success(`${reindeerDeleted.name} has been deleted.`);
      showReindeerImpactToast(reindeerDeleted);
    } catch {
      toast.error(`Failed to delete ${reindeerDeleted.name}.`);
    }
  };

  // Function to handle deleting a reindeers
  const handleDeleteCheckedReindeers = async () => {
    const reindeersToDelete = checkedReindeer.map((id) =>
      reindeersData.find((reindeer) => reindeer.id === id)
    );
    try {
      await deleteCheckedReindeer.mutateAsync(reindeersToDelete);
      toast.success("Reindeers deleted successfully");
      showReindeerImpactToast(reindeersToDelete);
    } catch {
      toast.error("Failed to delete selected reindeers");
    }
  };

  const showReindeerImpactToast = (reindeers) => {
    const reindeerList = Array.isArray(reindeers) ? reindeers : [reindeers];

    const impactedOrganizations = new Set();

    reindeerList.forEach((reindeer) => {
      // Find organizations that include the given reindeer
      const organizationsWithReindeer = organizationsData.filter(
        (organization) => {
          // Check if the organization contains the reindeer
          const containsReindeer = organization.positions.some(
            (position) => position.reindeerId === reindeer.id
          );

          // Return only the organizations that contain the reindeer
          return containsReindeer;
        }
      );

      organizationsWithReindeer.forEach((organization) => {
        impactedOrganizations.add(organization.id);
      });
    });

    // Show a toast if there are impacted organizations
    if (impactedOrganizations.size > 0) {
      toast.info(
        `With the removal, ${impactedOrganizations.size} organization${
          impactedOrganizations.size > 1 && "s"
        } were impacted and updated.`
      );
      generateOrganizationToView(null);
    }
  };

  return (
    <Card className="h-full flex flex-col justify-evenly">
      <CardHeader>
        <CardTitle>Reindeer list</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
          <SelectAll
            className="sm:col-span-2"
            items={reindeersData}
            selectedItems={checkedReindeer}
            onSelectionChange={(newSelection) =>
              setChecketReindeer(newSelection)
            }
          />
          <Input
            className="sm:col-span-3"
            type="text"
            placeholder="Filter reindeer names..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
          <Button
            variant="outline"
            onClick={() =>
              setModalState((prevState) => ({
                ...prevState,
                ReindeerModal: {
                  isOpen: true,
                  data: null,
                },
              }))
            }
          >
            <PlusSquare /> New
          </Button>
        </div>
        <ScrollArea className="h-72 rounded-md border p-2 box-border">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {reindeersData
              .filter((reindeer) =>
                reindeer.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((reindeer) => (
                <div key={reindeer.id}>
                  <Card className="grid grid-cols-1 gap-5 items-center p-3 bg-gradient-to-r from-red-100 to-green-100">
                    <div className="flex flex-col gap-3 items-center justify-center lg:justify-normal sm:flex-row">
                      <CustomCheckbox
                        className="data-[state=checked]:bg-green-400"
                        checked={checkedReindeer.includes(reindeer.id)}
                        onCheckedChange={(checked) =>
                          setChecketReindeer((prev) =>
                            checked
                              ? [...prev, reindeer.id]
                              : prev.filter((id) => id !== reindeer.id)
                          )
                        }
                      />
                      <CardTitle className="flex items-center gap-1">
                        <ReindeerIcon width="18px" height="18px" />
                        {reindeer.name}
                      </CardTitle>
                    </div>
                    <div className="flex flex-col items-center justify-between lg:flex-row">
                      {(reindeer.type === "master" && (
                        <Badge variant="outline" className="bg-purple-300">
                          Master
                        </Badge>
                      )) ||
                        (reindeer.type === "trainee" && (
                          <Badge variant="outline" className="bg-yellow-300">
                            Trainee
                          </Badge>
                        )) ||
                        (reindeer.type === "junior" && (
                          <Badge variant="outline" className="bg-orange-300">
                            Junior
                          </Badge>
                        ))}
                      <div className="flex justify-center">
                        <Button
                          onClick={() =>
                            setModalState((prevState) => ({
                              ...prevState,
                              ReindeerModalInfo: {
                                isOpen: true,
                                data: reindeer,
                              },
                            }))
                          }
                          variant="ghost"
                          size="icon"
                        >
                          <Eye />
                        </Button>
                        <Button
                          onClick={() =>
                            setModalState((prevState) => ({
                              ...prevState,
                              ReindeerModal: {
                                isOpen: true,
                                data: reindeer,
                              },
                            }))
                          }
                          variant="ghost"
                          size="icon"
                        >
                          <Pencil />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure you want to delete{" "}
                                {reindeer.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete {reindeer.name} and remove it
                                from Santa&apos;s workshop.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteReindeer(reindeer)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
          </div>
        </ScrollArea>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={checkedReindeer.length < 2}>
              <Trash2 /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure you want to delete these reindeers?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete these
                reindeers and remove them from Santa&apos;s workshop
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteCheckedReindeers}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
