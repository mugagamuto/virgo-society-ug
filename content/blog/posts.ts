export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  category: "Training" | "Loans" | "Community" | "Children";
};

export const posts: Post[] = [
  {
    slug: "why-financial-literacy-matters",
    title: "Why financial literacy matters for small groups",
    date: "2026-02-01",
    excerpt: "A simple framework for budgeting, saving and record-keeping that keeps groups stable.",
    category: "Training",
  },
  {
    slug: "building-a-revolving-loan-fund",
    title: "Building a healthy revolving loan fund",
    date: "2026-01-18",
    excerpt: "How fair terms and follow-up mentorship keep capital working for everyone.",
    category: "Loans",
  },
  {
    slug: "supporting-children-through-community",
    title: "Supporting children through community resilience",
    date: "2026-01-05",
    excerpt: "Why child support works best when households also grow stable income streams.",
    category: "Children",
  },
];
