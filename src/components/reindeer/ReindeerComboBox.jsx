import * as React from "react";

import { Check, SquarePlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReindeerIcon } from "@/components/global/iconsChristmas";

export default function ReindeerComboBox({ data, value, onChange = () => {} }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue === value ? null : selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between bg-transparent"
        >
          <ReindeerIcon width="18px" height="18px" />
          {value ? (
            data.find((reindeer) => reindeer.id === value)?.name || (
              <SquarePlus className="text-amber-900" />
            )
          ) : (
            <SquarePlus className="text-amber-900" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search reindeer..." className="h-9" />
          <CommandList>
            <CommandEmpty>No reindeer found.</CommandEmpty>
            <CommandGroup>
              {data.map((reindeer) => (
                <CommandItem
                  value={reindeer.name}
                  key={reindeer.id}
                  onSelect={() => handleSelect(reindeer.id)}
                >
                  {reindeer.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === reindeer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
