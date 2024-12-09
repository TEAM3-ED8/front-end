import { MapPin, Gift, Users, Cookie } from 'lucide-react';
import { StatCard } from "@/components/dashboard/statCard";
import { ReindeerChart } from "@/components/dashboard/reindeerChart";
import { ChildrenChart } from "@/components/dashboard/childrenChart";
import { ElvesChart } from "@/components/dashboard/elvesChart";
import { OrganizationChart } from "@/components/dashboard/organizationChart";
import { Countdown } from "@/components/dashboard/countDown";
import { UnderlineTitle } from "@/components/global/underlineTitle";
import { ChartContainer } from "@/components/ui/chart";

// Mock data (replace with actual TanStack Query hooks in production)
const mockData = {
  searches: 1234,
  reindeerStats: { master: 5, junior: 8, trainee: 3 },
  organizations: 12,
  selectedOrganization: "North Pole HQ",
  children: 1000000,
  letters: 500000,
  elves: 10000,
  elvesAvailable: 9500,
  behaviorData: [
    { month: "Jan", good: 80, naughty: 20 },
    { month: "Feb", good: 82, naughty: 18 },
    { month: "Mar", good: 85, naughty: 15 },
    { month: "Apr", good: 87, naughty: 13 },
    { month: "May", good: 85, naughty: 15 },
    { month: "Jun", good: 88, naughty: 12 },
  ],
  calories: {
    totalCookies: 1431,
    consumedCookies: 200,
    totalCalories: 22000
  }
};

export const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-bold text-red-600 mb-8">
        <UnderlineTitle text="Santa's Dashboard" />
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="col-span-1 lg:col-start-2 lg:col-span-2 flex justify-center items-center">
          <Countdown />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 md:gap-4 md:mb-0 md:ml-4">
        <StatCard
          icon={<MapPin className="h-4 w-4" />}
          title="Searches"
          value={totalSearches}
          subtitle={`Total address searches`}
        />
        <StatCard
          icon={<MailOpen className="h-4 w-4" />}
          title="Letters"
          value={totalLetters}
          subtitle={`${readLetters} read, ${unreadLetters} unread`}
        />

        <StatCard
          icon={<Users className="h-4 w-4" />}
          title="Children"
          value={totalChildren}
        />
        {/* <StatCard
          icon={<Cookie className="h-4 w-4" />}
          title="Calories Consumed"
          value={calories.totalCalories}
          subtitle={`${calories.consumedCookies} of ${calories.totalCookies} cookies`}
        /> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0">
        <div className="p-2 sm:p-4 md:py-6">
          <ChartContainer
            config={{
              master: { label: "Master", color: "#D32F2F" },
              junior: { label: "Junior", color: "#4d7c0f" },
              trainee: { label: "Trainee", color: "#ffc658" },
            }}
            className="min-h-[300px] w-full mb-10 md:mb-0"
          >
            <ReindeerChart
              data={[
                { name: "Master", value: reindeerStats.master, color: "#D32F2F" },
                { name: "Junior", value: reindeerStats.junior, color: "#4d7c0f" },
                { name: "Trainee", value: reindeerStats.trainee, color: "#ffc658" },
              ]}
            />
          </ChartContainer>
        </div>
        <div className="p-2 sm:p-4 md:py-6 mb-16 md:mb-0">
          <ChartContainer
            config={{
              Kind: { label: "Kind", color: behaviorColors.Kind },
              Respectful: { label: "Respectful", color: behaviorColors.Respectful },
              Lazy: { label: "Lazy", color: behaviorColors.Lazy },
              Helpful: { label: "Helpful", color: behaviorColors.Helpful },
              Curious: { label: "Curious", color: behaviorColors.Curious },
            }}
            className="mb-32 md:mb-0"
          >
            <PieChart
              data={behaviorSummary ? Object.entries(behaviorSummary).map(([behavior, count]) => ({
                name: behavior,
                value: count,
                color: behaviorColors[behavior],
              })) : []}
            />
          </ChartContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 md:gap-0">
        <div className="lg:col-span-2">
          <div className="p-2 sm:p-4 md:p-2 md:mt-20 2xl:mt-0">
            <ChartContainer
              config={{
                availableElves: { label: "Available Elves", color: "#4d7c0f" },
                unavailableElves: { label: "Unavailable Elves", color: "#D32F2F" },
              }}
              className="mb-28 md:mb-0"
            >
              <ElvesChart
                data={[
                  { name: "Available Elves", value: availableElves, color: "#4d7c0f" },
                  { name: "Unavailable Elves", value: unavailableElves, color: "#D32F2F" },
                ]}
              />
            </ChartContainer>
          </div>
        </div>
        <div className="p-2 sm:p-4 md:p-2 lg:mt-20 2xl:mt-0">
          <ChartContainer
            config={{
              selected: { label: "Selected", color: "#4d7c0f" },
              others: { label: "Others", color: "#CCCCCC" },
            }}
          >
            <OrganizationChart
              organizations={organizationsData?.length || 0}
              selectedOrganization={organizationsData?.[0]?.name || "N/A"}
            />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
