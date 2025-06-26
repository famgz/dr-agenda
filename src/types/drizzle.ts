import { doctorTable, patientTable, sexEnum } from '@/db/schema';

export type Doctor = typeof doctorTable.$inferSelect;
export type Patient = typeof patientTable.$inferSelect;
