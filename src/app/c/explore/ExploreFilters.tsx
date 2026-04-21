"use client";

import { useState } from "react";
import { Chip } from "@/components/ui";

interface ExploreFiltersProps {
  categories: string[];
}

export default function ExploreFilters({ categories }: ExploreFiltersProps) {
  const [active, setActive] = useState<string>("All");

  return (
    <div className="px-5 pt-5 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
      <Chip
        label="All"
        active={active === "All"}
        onClick={() => setActive("All")}
        size="sm"
      />
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          active={active === cat}
          onClick={() => setActive(cat)}
          size="sm"
        />
      ))}
    </div>
  );
}
