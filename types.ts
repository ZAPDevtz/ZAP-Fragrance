export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export interface TierProps {
  title: string;
  subtitle: string;
  features: string[];
  isPremium?: boolean;
}

export interface FeatureProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}