'use client';

import { useFormContext } from 'react-hook-form';
import { Progress } from '@/components/ui/progress';

export default function FormProgress() {
  const { watch } = useFormContext();
  const values = watch();
  
  const totalFields = Object.keys(values).length;
  const filledFields = Object.values(values).filter(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return value !== 0;
    return value !== undefined && value !== null;
  }).length;

  const progress = (filledFields / totalFields) * 100;

  return <Progress value={progress} className="w-full" />;
}