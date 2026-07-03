export interface Vehicle {
  id: string;
  name: string;
  subTitle: string;
  description: string;
  highlights: string[];
  bestFor: string[];
  specs: { label: string; value: string }[];
  image: string;
  interiorImage?: string;
  numericalSpecs?: { label: string; value: number; suffix: string }[];
}

export interface Pillar {
  number: string;
  title: string;
  description: string;
}

export interface AudienceCard {
  number: string;
  title: string;
  description: string;
}

export interface RouteItem {
  name: string;
  description: string;
  coordinates: { x: number; y: number }; // Relative percentage coordinates for our interactive map
}

export interface OccasionItem {
  number: string;
  title: string;
  description: string;
}

export interface ProofItem {
  title: string;
  value: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AccessClass {
  id: string;
  number: string;
  title: string;
  description: string;
  tagline?: string;
  image?: string;
}

export interface ServiceMatrixItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  details: string[];
}

export interface ValueCard {
  number: string;
  title: string;
  description: string;
}

export interface JourneyStep {
  id: string;
  number: string;
  title: string;
  status: string;
  instruction: string;
  tag: string;
  description: string;
  image: string;
}

export interface IntelRoute {
  id: string;
  name: string;
  sector: string;
  eta: string;
  description: string;
  coordinates: { x: number; y: number };
}
