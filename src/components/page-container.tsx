import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function PageContainer({ children }: Props) {
  return <div className="space-y-6 p-6">{children}</div>;
}

export function PageHeader({ children }: Props) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function PageHeaderContent({ children }: Props) {
  return <div className="space-y-1">{children}</div>;
}

export function PageTitle({ children }: Props) {
  return <h1 className="text-2xl font-bold">{children}</h1>;
}

export function PageDescription({ children }: Props) {
  return <p className="text-muted-foreground">{children}</p>;
}

export function PageActions({ children }: Props) {
  return <div className="flex items-center gap-2">{children}</div>;
}

export function PageContent({ children }: Props) {
  return <div className="space-y-6">{children}</div>;
}
