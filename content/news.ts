export type NewsCategory = "Social" | "News" | "Newsletters" | "";

export type NewsItem = {
  id: string;
  title: string;
  image: string;
  date: string;
  category: NewsCategory;
  slug: string;
  imagePosition?: string;
};
