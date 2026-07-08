import { z } from "zod";
import { TRUCK_TYPES } from "@/app/types/domain";

const addressSchema = z.object({
  label: z.string().min(1, "Give this location a short label"),
  line1: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(7, "Enter a valid phone number"),
});

export const createShipmentSchema = z.object({
  cargoDescription: z.string().min(3, "Describe the cargo in a few words"),
  cargoWeightKg: z.coerce.number().positive("Enter a weight greater than 0"),
  truckType: z.enum(TRUCK_TYPES),
  requestedPickupDate: z.string().min(1, "Choose a pickup date"),
  pickup: addressSchema,
  delivery: addressSchema,
});

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;
