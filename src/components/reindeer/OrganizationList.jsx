import * as React from "react";

import { ModalContext } from "@/components/reindeer/OrganizationManager";
import {
  useDeleteReindeersOrganization,
  useDeleteCheckedReindeerOrganizations,
} from "@/services/reindeer/organizationapi";
import SelectAll from "@/components/global/selectAll";
import CustomCheckbox from "@/components/global/customCheckbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Pencil, PlusSquare, Trash2, Eye } from "lucide-react";
import { SantaSleigh } from "@/components/global/iconsChristmas";
import { useToast } from "@/hooks/useToast";

export default function OrganizationList({
  data: organizationsData,
  generateOrganizationToView = () => {},
}) {
  // Use the context to access the state and its updater function
  const { setModalState } = React.useContext(ModalContext);

  const toast = useToast();
  const [checkedOrganization, setCheckedOrganization] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  // Mutations for managing organization data.
  const deleteReindeersOrganizationMutation = useDeleteReindeersOrganization();
  const deleteCheckedReindeerOrganization =
    useDeleteCheckedReindeerOrganizations();

  // Function to handle deleting a organization
  const handleDeleteOrganization = async (organizationDeleted) => {
    try {
      await deleteReindeersOrganizationMutation.mutateAsync(
        organizationDeleted
      );
      toast.success("Organization deleted successfully");
      generateOrganizationToView(null);
    } catch {
      toast.error("Failed to delete organization");
    }
  };

  // Function to handle deleting a organizations
  const handleDeleteCheckedOrganizations = async () => {
    const organizationsToDelete = checkedOrganization.map((id) =>
      organizationsData.find((organization) => organization.id === id)
    );
    try {
      await deleteCheckedReindeerOrganization.mutateAsync(
        organizationsToDelete
      );
      toast.success("Organizations deleted successfully");
      setCheckedOrganization([]);
    } catch {
      toast.error("Failed to delete selected organizations");
    }
  };

  const toggleCheckedOrganization = (id, isChecked) => {
    setCheckedOrganization((prevState) =>
      isChecked
        ? [...prevState, id]
        : prevState.filter((organizationId) => organizationId !== id)
    );
  };

  return (
    <Card className="h-full flex flex-col justify-evenly">
      <CardHeader>
        <CardTitle>Organizations list</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
          <SelectAll
            className="sm:col-span-2"
            items={organizationsData}
            selectedItems={checkedOrganization}
            onSelectionChange={(newSelection) =>
              setCheckedOrganization(newSelection)
            }
          />
          <Input
            className="sm:col-span-3"
            type="text"
            placeholder="Filter organization names..."
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
                OrganizationModal: {
                  isOpen: true,
                  data: null,
                },
              }))
            }
          >
            <PlusSquare />
            New
          </Button>
        </div>
        <ScrollArea className="h-72 rounded-md border p-2 box-border">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {organizationsData
              .filter((organization) =>
                organization.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((organization) => (
                <div key={organization.id}>
                  <Card className="grid grid-cols-1 gap-5 items-center p-3 bg-gradient-to-r from-red-100 to-green-100">
                    <div className="flex flex-col gap-3 items-center justify-center lg:justify-normal sm:flex-row">
                      <CustomCheckbox
                        checked={checkedOrganization.includes(organization.id)}
                        onCheckedChange={(checked) =>
                          toggleCheckedOrganization(organization.id, checked)
                        }
                      />
                      <CardTitle className="flex items-center gap-1">
                        <SantaSleigh width="18px" height="18px" />
                        {organization.name}
                      </CardTitle>
                    </div>
                    <div className="flex flex-col items-center justify-between lg:flex-row">
                      {organization.isSelected ? (
                        <Badge variant="outline" className="bg-orange-300">
                          Selected
                        </Badge>
                      ) : organization.isAvailable ? (
                        <Badge variant="outline" className="bg-green-300">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Incomplete</Badge>
                      )}
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            generateOrganizationToView(organization)
                          }
                          disabled={!organization.isAvailable}
                        >
                          <Eye />
                        </Button>
                        <Button
                          onClick={() => {
                            setModalState((prevState) => ({
                              ...prevState,
                              OrganizationModal: {
                                isOpen: true,
                                data: organization,
                              },
                            }));
                          }}
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
                                {organization.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete {organization.name} and
                                remove it from Santa&apos;s workshop.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  handleDeleteOrganization(organization);
                                  generateOrganizationToView(null);
                                }}
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
            <Button variant="outline" disabled={checkedOrganization.length < 2}>
              <Trash2 /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure you want to delete these organizations?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete these
                organizations and remove them from Santa&apos;s workshop
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteCheckedOrganizations}
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
