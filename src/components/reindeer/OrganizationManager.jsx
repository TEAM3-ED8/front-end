import { createContext, useEffect, useState } from "react";
import {
  useAddReindeer,
  useUpdateReindeer,
} from "@/services/reindeer/reindeerapi";
import {
  useAddReindeersOrganization,
  useUpdateReindeersOrganization,
} from "@/services/reindeer/organizationapi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/useToast";
import ReindeerModal from "@/components/reindeer/ReindeerModal";
import ReindeerModalInfo from "@/components/reindeer/ReindeerModalInfo";
import ReindeerList from "@/components/reindeer/ReindeerList";
import OrganizationModal from "@/components/reindeer/OrganizationModal";
import OrganizationOverview from "@/components/reindeer/OrganizationOverview";
import OrganizationGuide from "@/components/reindeer/OrganizationGuide";
import OrganizationList from "@/components/reindeer/OrganizationList";

export const ModalContext = createContext();

export default function OrganizationManager({ data }) {
  const { reindeersData, organizationsData } = data;
  const toast = useToast();

  const addReindeerMutation = useAddReindeer();
  const updateReindeerMutation = useUpdateReindeer();

  const addOrganizationMutation = useAddReindeersOrganization();
  const updateOrganizationMutation = useUpdateReindeersOrganization();

  const [modalState, setModalState] = useState({
    OrganizationModal: {
      isOpen: false,
      data: null,
    },
    ReindeerModal: {
      isOpen: false,
      data: null,
    },
    ReindeerModalInfo: {
      isOpen: false,
      data: null,
    },
  });

  const [organizationToView, setOrganizationToView] = useState(null);

  const handleMutation = async (
    mutation,
    data,
    success = "Operation successful",
    error = "Failed to complete the operation. Please verify the information."
  ) => {
    try {
      await mutation.mutateAsync(data);
      toast.success(success);
    } catch {
      toast.error(error);
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ModalContext.Provider value={{ modalState, setModalState }}>
          <Tabs defaultValue="organization">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="organization">Organizations</TabsTrigger>
              <TabsTrigger value="reindeers">Reindeers</TabsTrigger>
            </TabsList>
            <TabsContent value="organization">
              <OrganizationList
                data={organizationsData}
                generateOrganizationToView={setOrganizationToView}
                organizationToView={organizationToView}
              />
            </TabsContent>
            <TabsContent value="reindeers">
              <ReindeerList
                data={{ organizationsData, reindeersData }}
                generateOrganizationToView={setOrganizationToView}
              />
            </TabsContent>
          </Tabs>
          {organizationToView ? (
            <OrganizationOverview
              data={{ organizationToView, organizationsData, reindeersData }}
              generateOrganizationToView={setOrganizationToView}
            />
          ) : (
            <OrganizationGuide />
          )}
        </ModalContext.Provider>
      </section>
      <OrganizationModal
        isOpen={modalState.OrganizationModal.isOpen}
        isClose={() => {
          setModalState((prevState) => ({
            ...prevState,
            OrganizationModal: {
              isOpen: false,
              data: null,
            },
          }));
        }}
        onSubmit={(data) =>
          handleMutation(
            modalState.OrganizationModal.data
              ? updateOrganizationMutation
              : addOrganizationMutation,
            data,
            "Organization saved"
          )
        }
        data={{
          organizationData: modalState.OrganizationModal.data,
          reindeersData: reindeersData,
        }}
      />
      <ReindeerModalInfo
        isOpen={modalState.ReindeerModalInfo.isOpen}
        onClose={() =>
          setModalState((prevState) => ({
            ...prevState,
            ReindeerModalInfo: {
              isOpen: false,
              data: null,
            },
          }))
        }
        data={modalState.ReindeerModalInfo.data}
      />
      <ReindeerModal
        isOpen={modalState.ReindeerModal.isOpen}
        isClose={() => {
          setModalState((prevState) => ({
            ...prevState,
            ReindeerModal: {
              isOpen: false,
              data: null,
            },
          }));
        }}
        onSubmit={(data) =>
          handleMutation(
            modalState.ReindeerModal.data
              ? updateReindeerMutation
              : addReindeerMutation,
            data,
            "Reindeer saved"
          )
        }
        data={modalState.ReindeerModal.data}
      />
    </>
  );
}
