import { ComponentProps } from "react";

export default function Button({ ...props }: ComponentProps<'button'>) {
  const className = `cursor-pointer hover:underline ${props.className ?? ''}`;
  return <button {...props} className={className} />;
}
