import { doctorTable } from '@/db/schema';

export type Doctor = typeof doctorTable.$inferSelect;
