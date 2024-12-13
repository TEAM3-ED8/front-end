import { useReindeers } from "@/services/reindeer/reindeerapi";
import { useReindeersOrganizations } from "@/services/reindeer/organizationapi";
import {
  LoadingScreen,
  ErrorScreen,
} from "@/components/global/santaDataLoader";
import OrganizationManager from "@/components/reindeer/OrganizationManager";
// import { WeatherCard } from "@/components/reindeer/WeatherCard";
import { UnderlineTitle } from "@/components/global/underlineTitle";

export const ReindeerPage = () => {
  const {
    data: reindeersData,
    isLoading: isLoadingReindeers,
    isError: isErrorReindeers,
  } = useReindeers();

  const {
    data: organizationsData,
    isLoading: isLoadingOrganizations,
    isError: isErrorOrganizations,
  } = useReindeersOrganizations();

  if (isLoadingReindeers || isLoadingOrganizations) return <LoadingScreen />;
  if (isErrorReindeers || isErrorOrganizations) return <ErrorScreen />;

  return (
    <section>
      <h1 className="text-4xl font-bold text-red-600 text-center ">
        <UnderlineTitle text="Reindeer Setup" />
      </h1>
      <div className="flex flex-col sm:p-8">{/*<WeatherCard />*/}</div>
      <div className="flex flex-col gap-5 sm:p-8">
        <OrganizationManager data={{ reindeersData, organizationsData }} />
      </div>
    </section>
  );
};
