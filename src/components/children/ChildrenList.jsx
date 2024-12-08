import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Baby, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SantaChristmasSpinner from "@/components/global/spinner";
import ChildModal from '@/components/children/ChildModal';
import { useChildren, useUpdateChild } from '@/services/children/childrenapi';
import { UnderlineTitle } from '@/components/global/underlineTitle';

export const ChildrenList = () => {
  const { data: children, isLoading, isError } = useChildren();
  const { mutate: updateChild } = useUpdateChild();
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const behaviors = ["Kind", "Respectful", "Lazy", "Helpful", "Curious"];

  const filteredChildren = children
    ? children.filter(child => {
      const matchesSearch = child.name.toLowerCase().includes(search.toLowerCase());
      if (filter === "all") return matchesSearch;
      return matchesSearch && child.behavior.toLowerCase() === filter.toLowerCase();
    })
    : [];

  if (isLoading) {
    return (
      <div className="grid place-items-center h-full">
        <SantaChristmasSpinner />
      </div>
    );
  }

  if (isError) return <div>Error fetching children</div>;


  const getBehaviorColor = (behavior) => {
    const colors = {
      Kind: "bg-blue-300",
      Respectful: "bg-green-300",
      Lazy: "bg-purple-300",
      Helpful: "bg-yellow-300",
      Curious: "bg-red-300"
    }
    return colors[behavior] || "bg-gray-300"
  }

  return (
    <>
      <div className='max-2-xl mx-auto p-4 md:p-6'>
        {/* Header */}
        <h1 className="text-4xl text-center font-bold text-red-600 mb-8">
        <UnderlineTitle text="Children Sorter" />
      </h1>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search children by name..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2 h-full text-zinc-800">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
            {behaviors.map((behavior) => (
              <TabsTrigger
                key={behavior}
                value={behavior.toLowerCase()}
                onClick={() => setFilter(behavior.toLowerCase())}
              >
                {behavior}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {/* List */}
        <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {filteredChildren.map((child) => (
            <Card key={child.id} className='p-4 space-y-4 bg-gradient-to-l from-green-50 to-rose-100'>
              <div className='flex items-center gap-3'>
                <Baby className='rounded-full' width={40} height={40} />
                <article className='flex-1 min-w-0'>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{child.name}</p>
                    <ChildModal
                      child={child}
                      onSubmit={(updatedChild) => updateChild(updatedChild)}
                    />
                  </div>
                </article>
              </div>
              <div className='flex items-center justify-between mt-1'>
                <Badge variant="secondary" className={getBehaviorColor(child.behavior)}>{child.behavior}</Badge>
                <span className='text-sm text-muted-foreground'>Behavior Level: {child.levelBehavior}</span>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </>
  )
}
