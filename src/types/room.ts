import { FeatureCategory } from "@/components/hotel/FeatureListDisplay";

export interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null> | null;
  description: string | null;
  custom_description: string | null;
  additional_features: FeatureCategory[] | null;
}