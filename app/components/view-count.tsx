"use client";

import { useEffect, useState } from "react";
import { Loader } from "./loader";

export function ViewCount({ countmyclick }: { countmyclick?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      if (!countmyclick) return;

      try {
        const response = await fetch(`https://countmy.click/${countmyclick}`);
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error('Error fetching view count:', error);
      }
    };

    fetchCount();
  }, [countmyclick]);

  if (!countmyclick) {
    return null
  }

  return (
    <div className="text-sm text-accent h-4 flex items-center">
      {count === null ? <Loader className="text-foreground w-4 h-4" /> : (
        <>
          {(count ?? 0).toLocaleString()} view{count !== 1 ? 's' : ''}
        </>
      )}

    </div>
  );
}
