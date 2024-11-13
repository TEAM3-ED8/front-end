import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { ChristmasSantaSleight } from "@/components/global/iconsChristmas";
import ReindeerComboBox from "@/components/reindeer/ReindeerComboBox";

export default function SleightCard({ data }) {
  const listReindeers = data
    .filter((reindeer) => reindeer.available)
    .map((reindeer) => ({
      id: reindeer.id,
      name: reindeer.name,
      position: reindeer.position,
    }));

  const saveOrderReinnders = (event) => {
    event.preventDefault();
  };

  return (
    <Card className="h-1/2">
      <CardHeader>
        <CardTitle>Organize your reindeer</CardTitle>
        <CardDescription>
          Organize the reindeer for Santa's sleigh. Click each button to assign
          a different reindeer to its position. When you click a button, a menu
          will appear with a list of available reindeer for easy selection
        </CardDescription>
      </CardHeader>
      <form onSubmit={saveOrderReinnders}>
        <CardContent className="flex items-center justify-center p-5 w-full gap-3">
          <ChristmasSantaSleight className="w-1/2" />
          <div className="flex flex-col w-1/2 gap-5">
            <h3 className="ml-5 text-center font-semibold">
              Select Reindeers 🦌
            </h3>
            <div className="grid grid-cols-3 gap-3 place-items-center">
              <ReindeerComboBox
                reindeers={listReindeers}
                value={
                  listReindeers.find((reindeer) => reindeer.position === 1)
                    ?.id ?? 0
                }
              />
              <ReindeerComboBox
                reindeers={listReindeers}
                value={
                  listReindeers.find((reindeer) => reindeer.position === 2)
                    ?.id ?? 0
                }
              />
              <ReindeerComboBox
                reindeers={listReindeers}
                value={
                  listReindeers.find((reindeer) => reindeer.position === 3)
                    ?.id ?? 0
                }
              />
              <ReindeerComboBox
                reindeers={listReindeers}
                value={
                  listReindeers.find((reindeer) => reindeer.position === 4)
                    ?.id ?? 0
                }
              />
              <ReindeerComboBox
                reindeers={listReindeers}
                value={
                  listReindeers.find((reindeer) => reindeer.position === 5)
                    ?.id ?? 0
                }
              />
              <ReindeerComboBox
                reindeers={listReindeers}
                value={
                  listReindeers.find((reindeer) => reindeer.position === 6)
                    ?.id ?? 0
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Check /> Mark all as read
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}