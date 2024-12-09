import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MapRoute from "@/components/santaroutes/mapRoute";
import AddressHistory from "@/components/santaroutes/addressHistory";
import {
  searchLocation,
  saveLocation,
  getSearchHistory,
  getRoute,
  deleteLocation,
} from "@/services/santaroutes/santaroutes";
import { UnderlineTitle } from "@/components/global/underlineTitle";
import { useToast } from "@/hooks/useToast";
import {
  LoadingScreen,
  ErrorScreen,
} from "@/components/global/santaDataLoader";

const NORTH_POLE = { lat: "25.7617", lng: "-80.1918", display_name: "Miami, Florida" };

export const RoutesPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: searchHistoryData, isLoading: isHistoryLoading, isError: isHistoryError, error: historyError } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: getSearchHistory,
  });
  const searchHistory = searchHistoryData?.data || [];

  const searchMutation = useMutation({
    mutationFn: searchLocation,
    onSuccess: (data) => {
      if (data && data.length > 0) {
        const location = {
          display_name: data[0].display_name,
          lat: data[0].lat,
          lng: data[0].lng,
        };
        if (location) {
          routeMutation.mutate({
            start: NORTH_POLE,
            end: {
              lat: location.lat,
              lng: location.lng,
              name: location.display_name
            }
          });
        }
      } else {
        toast.error("No location found. Please try a more specific search.");
      }
    },
    onError: (error) => {
      console.error('Search error:', error);
      toast.error(error.message || "Error searching location. Please try again.");
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveLocation,
    onSuccess: () => {
      queryClient.invalidateQueries("searchHistory");
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error(error.message || "Error saving location.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries("searchHistory");
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting location.");
    },
  });

  const routeMutation = useMutation({
    mutationFn: ({ start, end }) => {
      if (!start.lat || !start.lng || !end.lat || !end.lng) {
        throw new Error("Invalid coordinates. Please try again with a valid location.");
      }
      return getRoute(
        { lat: parseFloat(start.lat), lng: parseFloat(start.lng) },
        { lat: parseFloat(end.lat), lng: parseFloat(end.lng) }
      );
    },
    onSuccess: (data, variables) => {
      if (data && data.routes && data.routes[0]) {
        const coordinates = decodePolyline(data.routes[0].geometry).map(coord => [coord[0], coord[1]]);
        queryClient.setQueryData(["currentRoute"], {
          coordinates,
          start: variables.start,
          end: {
            lat: variables.end.lat,
            lng: variables.end.lng,
            name: variables.end.name
          },
        });
        toast.success("Route restored successfully!");
      } else {
        toast.error("No route found. The destination might be unreachable.");
      }
    },
    onError: (error) => {
      console.error("Route calculation error:", error);
      toast.error(error.message || "Error calculating route. The destination might be unreachable or there's no valid path.");
    },
  });

  const handleSearch = async (query) => {
    const result = await searchMutation.mutateAsync({ query });
    return result;
  };

  const handleSave = (location) => {
    saveMutation.mutate(location);
  };

  const handleRestore = (location) => {
    if (location && location.lat && location.lng) {
      routeMutation.mutate({
        start: NORTH_POLE,
        end: {
          lat: location.lat,
          lng: location.lng,
          name: location.display_name
        }
      });
    } else {
      toast.error("Invalid location data. Unable to restore the route.");
    }
  };

  const handleDelete = (location) => {
    deleteMutation.mutate(location);
    resetCurrentRoute();
  };

  const resetCurrentRoute = () => {
    queryClient.setQueryData(["currentRoute"], null);
  };

  const handleDeleteAll = () => {
    searchHistory.forEach((location) => deleteMutation.mutate(location));
    resetCurrentRoute();
    toast.success("All locations deleted successfully");
  };

  function decodePolyline(encoded) {
    const poly = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;
      poly.push([lat / 1e5, lng / 1e5]);
    }
    return poly;
  }

  const currentRoute = queryClient.getQueryData(["currentRoute"]);

  if (
    searchMutation.isLoading ||
    saveMutation.isLoading ||
    deleteMutation.isLoading ||
    routeMutation.isLoading ||
    isHistoryLoading
  ) {
    return <LoadingScreen />;
  }

  if (isHistoryError) {
    return <ErrorScreen message={historyError.message || "Error loading search history"} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 w-full flex-grow">
        <h1 className="text-4xl font-bold text-red-700 mb-10 text-center">
          <UnderlineTitle text="Santa's Routes" />
        </h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-3/5">
            <MapRoute
              className="h-[400px] lg:h-[600px]"
              currentRoute={currentRoute?.end}
              routeCoordinates={currentRoute?.coordinates}
              northPole={NORTH_POLE}
              onSearch={handleSearch}
              onSave={handleSave}
            />
          </div>
          <div className="w-full lg:w-2/5">
            <AddressHistory
              locations={searchHistory}
              onRestore={handleRestore}
              onDelete={handleDelete}
              onDeleteAll={handleDeleteAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
