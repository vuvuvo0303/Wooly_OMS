export type PartColor = {
  colorID: number;
  partColor: string;
};

export type Part = {
  partID: number;
  partName: string;
  partColors: PartColor[];
};

export type Product = {
  productID: number;
  description: string;
  imageUrl: string;
  productName: string;
  price: number;
  stockQuantity: number;
  category: string;
  partNames: Part[]; 
};