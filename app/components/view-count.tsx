"use client";

import { useEffect, useState } from "react";

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
  }, []);

  if (!countmyclick) {
    return null
  }

  return (
    <div className="text-sm text-accent">
      {(count ?? 0).toLocaleString()} views
    </div>
  );
}
