import React from "react";

export interface DetailsProps {
  title: string;
  children: React.ReactNode;
}

export default function Details({ title, children }: DetailsProps) {
  return (
    <details>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}