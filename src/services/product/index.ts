import http from "@/utils/request";
import type {
  CreateProductParams,
  CreateProductResponse,
  ProductMinePageData,
  ProductMineQuery,
  ProductListPageData,
  ProductListQuery,
  ProductDetail,
  UpdateProductParams,
} from "./dto";

const BASE_URL = "/api/product";

export const productService = {
  create: (params: CreateProductParams) => {
    const formData = new FormData();

    formData.append("name", params.name);
    if (params.description) {
      formData.append("description", params.description);
    }
    formData.append("price", String(params.price));
    formData.append("statusCode", String(params.statusCode));
    formData.append("conditionCode", String(params.conditionCode));
    if (params.purchasedAt) {
      formData.append("purchasedAt", params.purchasedAt);
    }
    if (params.category) {
      formData.append("category", params.category);
    }
    if (params.stock !== undefined) {
      formData.append("stock", String(params.stock));
    }
    formData.append("mainImage", params.mainImage);
    params.images?.forEach((file) => {
      formData.append("images", file);
    });

    return http.post<CreateProductResponse>(`${BASE_URL}/create`, formData);
  },

  mine: (query: ProductMineQuery = {}) => {
    const search = new URLSearchParams();
    if (query.current !== undefined) {
      search.set("current", String(query.current));
    }
    if (query.pageSize !== undefined) {
      search.set("pageSize", String(query.pageSize));
    }
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return http.get<ProductMinePageData>(`${BASE_URL}/mine${suffix}`);
  },

  list: (query: ProductListQuery = {}) => {
    const search = new URLSearchParams();
    if (query.keyword) {
      search.set("keyword", query.keyword);
    }
    if (query.conditionCode !== undefined) {
      search.set("conditionCode", String(query.conditionCode));
    }
    if (query.current !== undefined) {
      search.set("current", String(query.current));
    }
    if (query.pageSize !== undefined) {
      search.set("pageSize", String(query.pageSize));
    }
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return http.get<ProductListPageData>(`${BASE_URL}/list${suffix}`);
  },

  detail: (id: number) => {
    return http.get<ProductDetail>(`${BASE_URL}/${id}`);
  },

  update: (id: number, params: UpdateProductParams) => {
    return http.post<void>(`${BASE_URL}/updateStatus`, params);
  },
};

export default productService;
