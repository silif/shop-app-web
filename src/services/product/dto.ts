export type ProductStatusCode = 1 | 2;

export type ProductConditionCode = 1 | 2 | 3 | 4 | 5 | 6;

export interface CreateProductParams {
  name: string;
  description?: string;
  price: number;
  statusCode: ProductStatusCode;
  conditionCode: ProductConditionCode;
  purchasedAt?: string;
  category?: string;
  stock?: number;
  mainImage: File;
  images?: File[];
}

export interface CreateProductResponse {
  id: number;
  name: string;
}

export interface ProductMineItem {
  id: number;
  name: string;
  description?: string;
  price?: number;
  statusCode?: ProductStatusCode;
  conditionCode?: ProductConditionCode;
  purchasedAt?: string;
  mainImageUrl?: string;
  category?: string;
  stock?: number;
  [key: string]: unknown;
}

export interface ProductMinePageData {
  content: ProductMineItem[];
  pageSize: number;
  current: number;
  total: number;
}

export interface ProductMineQuery {
  current?: number;
  pageSize?: number;
}

export type ConditionCode = 1 | 2 | 3 | 4 | 5 | 6;

export interface ProductListItem {
  id: number;
  name: string;
  description?: string;
  price?: number;
  statusCode?: ProductStatusCode;
  conditionCode?: ProductConditionCode;
  purchasedAt?: string;
  mainImageUrl?: string;
  category?: string;
  stock?: number;
  [key: string]: unknown;
}

export interface ProductListPageData {
  content: ProductListItem[];
  pageSize: number;
  current: number;
  total: number;
}

export interface ProductListQuery {
  keyword?: string;
  conditionCode?: ConditionCode;
  current?: number;
  pageSize?: number;
}
