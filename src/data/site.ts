export type Category = "vegetable" | "fruit" | "botanical" | "mix";

export type Pack = {
  size: string;
  price: number;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  description: string;
  detail: string;
  image?: string;
  accent: string;
  available: boolean;
  botanicalName: string;
  form: string;
  origin: string;
  applications: string[];
  packSize: string;
  moq: string;
  packs?: Pack[];
};

export const categoryLabels: Record<Category, string> = {
  vegetable: "Dehydrated vegetables",
  fruit: "Dehydrated fruits",
  botanical: "Dehydrated botanicals",
  mix: "Mixes",
};

export const productSpecs = [
  { parameter: "Appearance", value: "Available on request" },
  { parameter: "Aroma", value: "Available on request" },
  { parameter: "Solubility", value: "Available on request" },
  { parameter: "Particle size", value: "Available on request" },
  { parameter: "Bulk density", value: "Available on request" },
  { parameter: "Packaging", value: "Available on request" },
  { parameter: "Storage", value: "Available on request" },
];

export const products: Product[] = [
  {
    slug: "abc-mix-powder",
    name: "ABC Mix Powder",
    category: "mix",
    description: "Amla, beetroot and carrot powder with vitamins, minerals and antioxidants.",
    detail:
      "TRUFINE ABC mix powder blends dehydrated amla, beetroot and carrot in a 100g retail pack. The label highlights vitamins, minerals and antioxidants. Bulk quantities are available on request.",
    image: "/images/products/abc-mix-label.jpg",
    accent: "#C45C26",
    available: true,
    botanicalName: "Phyllanthus emblica, Beta vulgaris, Daucus carota",
    form: "Dehydrated powder blend",
    origin: "India",
    applications: ["Beverages", "Food", "Everyday cooking"],
    packSize: "100g retail pack; bulk formats available on request",
    moq: "1 retail pack; bulk on request",
    packs: [{ size: "100g", price: 249 }],
  },
  {
    slug: "beetroot-powder",
    name: "Beetroot Powder",
    category: "vegetable",
    description: "Dehydrated beetroot powder, rich in iron, fiber and antioxidants.",
    detail:
      "TRUFINE beetroot powder is a dehydrated vegetable product in a 100g retail pack. The label highlights iron, fiber and antioxidants. Bulk quantities are available on request.",
    image: "/images/products/beetroot-powder-label.jpg",
    accent: "#7A1E3A",
    available: true,
    botanicalName: "Beta vulgaris",
    form: "Dehydrated powder",
    origin: "India",
    applications: ["Beverages", "Soups & sauces", "Bakery"],
    packSize: "100g and 150g retail packs; bulk formats available on request",
    moq: "1 retail pack; bulk on request",
    packs: [
      { size: "100g", price: 249 },
      { size: "150g", price: 238 },
    ],
  },
  {
    slug: "amla-powder",
    name: "Amla Powder",
    category: "fruit",
    description: "Dehydrated amla powder, rich in vitamin C and antioxidants.",
    detail:
      "TRUFINE amla powder is a dehydrated fruit powder in a 100g retail pack. The label highlights vitamin C and antioxidants. It is a food ingredient, not a medicinal product. Bulk quantities are available on request.",
    image: "/images/products/amla-powder.jpg",
    accent: "#C6B15A",
    available: true,
    botanicalName: "Phyllanthus emblica",
    form: "Dehydrated powder",
    origin: "India",
    applications: ["Beverages", "Food", "Formulations"],
    packSize: "100g and 150g retail packs; bulk formats available on request",
    moq: "1 retail pack; bulk on request",
    packs: [
      { size: "100g", price: 299 },
      { size: "150g", price: 213 },
    ],
  },
  {
    slug: "carrot-powder",
    name: "Carrot Powder",
    category: "vegetable",
    description: "Dehydrated carrot powder, rich in vitamin A and beta-carotene.",
    detail:
      "TRUFINE carrot powder is a dehydrated vegetable product in a 100g retail pack. The label highlights vitamin A and beta-carotene. Bulk quantities are available on request.",
    image: "/images/products/carrot-powder-label.jpg",
    accent: "#C45C26",
    available: true,
    botanicalName: "Daucus carota",
    form: "Dehydrated powder",
    origin: "India",
    applications: ["Food & beverage", "Seasoning", "Formulations"],
    packSize: "100g and 150g retail packs; bulk formats available on request",
    moq: "1 retail pack; bulk on request",
    packs: [
      { size: "100g", price: 249 },
      { size: "150g", price: 204 },
    ],
  },
  {
    slug: "moringa-leaf-powder",
    name: "Moringa Leaf Powder",
    category: "botanical",
    description: "Dehydrated moringa powder, rich in iron, calcium and antioxidants.",
    detail:
      "TRUFINE moringa powder is a dehydrated leaf powder in a 100g retail pack. The label highlights iron, calcium and antioxidants. It is a food ingredient, not a medicinal product. Bulk quantities are available on request.",
    image: "/images/products/moringa-powder.jpg",
    accent: "#2D5A27",
    available: true,
    botanicalName: "Moringa oleifera",
    form: "Dehydrated leaf powder",
    origin: "India",
    applications: ["Food & beverage", "Seasoning", "Formulations"],
    packSize: "100g and 150g retail packs; bulk formats available on request",
    moq: "1 retail pack; bulk on request",
    packs: [
      { size: "100g", price: 249 },
      { size: "150g", price: 229 },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getRelatedProducts(slug: string, count = 3) {
  const current = getProduct(slug);
  if (!current) return [];
  const same = products.filter(
    (item) => item.slug !== slug && item.category === current.category,
  );
  if (same.length >= count) return same.slice(0, count);
  const rest = products.filter(
    (item) => item.slug !== slug && item.category !== current.category,
  );
  return [...same, ...rest].slice(0, count);
}

export const contact = {
  email: "trufinefoods@gmail.com",
  phone: "+91 96769 49495",
  whatsapp: "919676949495",
  instagram: "trufinefoods",
  address: "8-86/1 Indira Nagar, Chityala, Nalgonda - 508114, Telangana, India",
};

export const seller = {
  legalName: "TRUFINE FOODS",
  gstin: "",
};

export const shop = {
  // discountCode: "BUY3GET8%",
  // discountMinQty: 3,
  // discountRate: 0.08,
  shippingFee: 130,
  freeShippingSubtotal: 1000,
};
