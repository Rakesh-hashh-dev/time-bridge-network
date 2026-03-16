export interface MockSkill {
  id: string;
  title: string;
  description: string;
  category: "Tech" | "Arts" | "Language" | "Trade" | "Wellness";
  userName: string;
  creditsPerHour: number;
  rating: number;
  type: "offer";
}

export const mockSkills: MockSkill[] = [
  {
    id: "1",
    title: "Python Basics",
    description: "Learn Python fundamentals including variables, loops, functions, and basic data structures. Perfect for absolute beginners.",
    category: "Tech",
    userName: "Sarah J.",
    creditsPerHour: 1,
    rating: 4.8,
    type: "offer",
  },
  {
    id: "2",
    title: "Logo Design",
    description: "I'll help you create a professional logo for your project or small business using Figma and Illustrator.",
    category: "Arts",
    userName: "Marcus K.",
    creditsPerHour: 2,
    rating: 4.9,
    type: "offer",
  },
  {
    id: "3",
    title: "Conversational French",
    description: "Practice your French speaking skills with a native speaker. Focus on everyday conversation and pronunciation.",
    category: "Language",
    userName: "Elena R.",
    creditsPerHour: 1,
    rating: 5.0,
    type: "offer",
  },
  {
    id: "4",
    title: "Basic Plumbing",
    description: "Learn how to fix common household plumbing issues — leaky faucets, clogged drains, and toilet repairs.",
    category: "Trade",
    userName: "David L.",
    creditsPerHour: 1,
    rating: 4.7,
    type: "offer",
  },
  {
    id: "5",
    title: "Yoga for Beginners",
    description: "Gentle yoga sessions focused on flexibility, breathing techniques, and stress relief. No experience needed.",
    category: "Wellness",
    userName: "Chloe W.",
    creditsPerHour: 1,
    rating: 4.9,
    type: "offer",
  },
  {
    id: "6",
    title: "Video Editing",
    description: "Learn to edit videos using DaVinci Resolve — cutting, transitions, color grading, and exporting for social media.",
    category: "Tech",
    userName: "James P.",
    creditsPerHour: 2,
    rating: 4.6,
    type: "offer",
  },
];
