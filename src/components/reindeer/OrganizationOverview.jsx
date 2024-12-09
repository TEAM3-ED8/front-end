import { useUpdateReindeersOrganization } from "@/services/reindeer/organizationapi";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import {
  ReindeerIcon,
  ChristmasSantaSleight,
} from "@/components/global/iconsChristmas";
import PropTypes from "prop-types";

export default function OrganizationOverview({
  data: { organizationToView, organizationsData, reindeersData },
  generateOrganizationToView = () => {},
}) {
  const toast = useToast();

  // Mutations for managing organization data.
  const updateOrganizationsMutation = useUpdateReindeersOrganization();

  // Function to handle selecting a reindeer's organization
  const handleSelectOrganization = async () => {
    if (!organizationToView || !organizationsData) {
      toast.error("Unable to select organization. Missing data.");
      return;
    }

    // Update only the selected organization
    const updatedOrganization = {
      ...organizationToView,
      isSelected: true,
      positions: organizationToView.positions.map(
        ({ position, reindeerId }) => ({
          position: Number(position),
          reindeerId: Number(reindeerId),
        })
      ),
    };

    try {
      await updateOrganizationsMutation.mutateAsync(updatedOrganization);
      generateOrganizationToView(updatedOrganization);
      toast.success(`${updatedOrganization.name} has been selected.`);
    } catch (error) {
      console.error("Error updating organization:", error);
      generateOrganizationToView(null);
      toast.error(
        "Failed to select organization. Please verify and complete all required information."
      );
    }
  };

  if (!organizationToView) {
    return null; // or return a placeholder component
  }

  return (
    <Card>
      <div className="h-full flex flex-col justify-between box-border">
        <CardContent className="flex flex-col items-center p-5 gap-3">
          <CardTitle>{`${organizationToView.name} organization`}</CardTitle>
          <ChristmasSantaSleight />
          <div className="grid grid-cols-3 gap-3 place-items-center">
            {organizationToView.positions &&
              organizationToView.positions.map(({ position, reindeerId }) => {
                // Get the name of the reindeer based on its ID in organization
                const reindeer =
                  reindeersData &&
                  reindeersData.find(({ id }) => id === Number(reindeerId));
                const reindeerName = reindeer
                  ? reindeer.name
                  : "Unknown Reindeer";
                return (
                  <Card
                    key={position}
                    className="flex items-center justify-center p-2 rounded-sm"
                  >
                    <ReindeerIcon width="18px" height="18px" />
                    <CardTitle>{reindeerName}</CardTitle>
                  </Card>
                );
              })}
          </div>
        </CardContent>
        <CardFooter>
          {organizationToView && !organizationToView.isSelected && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleSelectOrganization}
            >
              <Check /> Select {organizationToView.name}
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}

OrganizationOverview.propTypes = {
  data: PropTypes.shape({
    organizationToView: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      positions: PropTypes.arrayOf(
        PropTypes.shape({
          position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          reindeerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
      ),
      isSelected: PropTypes.bool,
      isAvailable: PropTypes.bool,
    }),
    organizationsData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        isSelected: PropTypes.bool.isRequired,
      })
    ),
    reindeersData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  generateOrganizationToView: PropTypes.func.isRequired,
};
