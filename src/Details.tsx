import React from "react";

export interface DetailsProps {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}

export default function Details({ title, children, open }: DetailsProps) {
  return (
    <details open={open}>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}