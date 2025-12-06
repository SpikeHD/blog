"use client";

export function PostDate({ dateString }: { dateString: string }) {
  const date = new Date(dateString);
  const today = new Date();
  const options = {
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const
  }

  return (
    <span>{date.toLocaleString("en-US", options)} ({timeSince(date, today)})</span>
  );
}

function timeSince(date: Date, today: Date): string {
  const seconds = Math.floor((today.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);

  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);

  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);

  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);

  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }

  return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
}
