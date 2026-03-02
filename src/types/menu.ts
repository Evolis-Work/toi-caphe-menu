export type MenuTemp = "hot" | "cold" | "both" | "none";

export interface MenuItem {
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  bestseller: boolean;
  temp: MenuTemp;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}
