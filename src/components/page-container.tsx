import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: Props) {
  return <div className={cn(className, 'space-y-6 p-6')}>{children}</div>;
}

export function PageHeader({ children, className }: Props) {
  return (
    <div className={cn(className, 'flex items-center justify-between')}>
      {children}
    </div>
  );
}

export function PageHeaderContent({ children, className }: Props) {
  return <div className={cn(className, 'space-y-1')}>{children}</div>;
}

export function PageTitle({ children, className }: Props) {
  return <h1 className={cn(className, 'text-2xl font-bold')}>{children}</h1>;
}

export function PageDescription({ children, className }: Props) {
  return <p className={cn(className, 'text-muted-foreground')}>{children}</p>;
}

export function PageActions({ children, className }: Props) {
  return (
    <div className={cn(className, 'flex items-center gap-2')}>{children}</div>
  );
}

export function PageContent({ children, className }: Props) {
  return <div className={cn(className, 'space-y-6')}>{children}</div>;
}
