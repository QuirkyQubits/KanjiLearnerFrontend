import React from "react";

export interface DetailsProps {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
}

export default function Details({ title, children, open }: DetailsProps) {
  return (
    <details className="bg-background text-text px-4 py-2" open={open}>
      <summary className="mt-5">{title}</summary>
      <div  className="mt-1">{children}</div>
    </details>
  );
}