import {
  appointmentTable,
  doctorTable,
  patientTable,
  statusEnum,
} from '@/db/schema';

export type Doctor = typeof doctorTable.$inferSelect;
export type Patient = typeof patientTable.$inferSelect;
export type Appointment = typeof appointmentTable.$inferSelect;
export type AppointmentWithRelations = typeof appointmentTable.$inferSelect & {
  doctor: typeof doctorTable.$inferSelect;
  patient: typeof patientTable.$inferSelect;
};
export type AppointmentStatus = (typeof statusEnum.enumValues)[number];
