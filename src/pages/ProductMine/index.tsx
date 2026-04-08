import { useEffect, useMemo, useState } from "react";
import { Modal, Pagination } from "antd";
import { productService } from "@/services";
import { resolveImageUrl } from "@/config";
import type { ProductMineItem, ProductMinePageData } from "@/services/product/dto";
import styles from "./ProductMine.module.css";

const PAGE_SIZE = 4;
const STATUS_LABELS: Record<number, string> = {
  1: "在售",
  2: "预定",
  3: "已售",
  4: "已下架",
};

const CONDITION_LABELS: Record<number, string> = {
  1: "全新",
  2: "几乎全新",
  3: "轻微使用痕迹",
  4: "明显使用痕迹",
  5: "成色较差",
  6: "有瑕疵或异常",
};

const normalizeMinePage = (payload: unknown): ProductMinePageData => {
  if (payload && typeof payload === "object") {
    const obj = payload as Partial<ProductMinePageData>;
    return {
      content: Array.isArray(obj.content) ? obj.content : [],
      pageSize: typeof obj.pageSize === "number" ? obj.pageSize : PAGE_SIZE,
      current: typeof obj.current === "number" ? obj.current : 0,
      total: typeof obj.total === "number" ? obj.total : 0,
    };
  }
  return {
    content: [],
    pageSize: PAGE_SIZE,
    current: 0,
    total: 0,
  };
};

export default function ProductMinePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<ProductMineItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductMineItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await productService.mine({
          current: currentPage,
          pageSize: PAGE_SIZE,
        });
        const normalized = normalizeMinePage(response);
        if (!cancelled) {
          setProducts(normalized.content);
          setTotal(normalized.total || 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "获取商品列表失败");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const hasData = useMemo(() => products.length > 0, [products]);

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <h1>我的商品</h1>

        {loading && <p className={styles.tip}>加载中...</p>}
        {error && !loading && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <>
            {!hasData ? (
              <p className={styles.tip}>暂无商品，快去发布闲置吧。</p>
            ) : (
              <>
                <div className={styles.grid}>
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className={styles.card}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.mainImageUrl ? (
                        <img src={resolveImageUrl(product.mainImageUrl)} alt={product.name} />
                      ) : (
                        <div className={styles.imagePlaceholder}>暂无主图</div>
                      )}
                      <h3>{product.name}</h3>
                      <p className={styles.price}>
                        {product.price !== undefined ? `￥${product.price}` : "价格待定"}
                      </p>
                      <p className={styles.meta}>
                        {product.category || "未分类"} · 库存 {product.stock ?? 0}
                      </p>
                    </button>
                  ))}
                </div>

                <div className={styles.pagination}>
                  <Pagination
                    current={currentPage + 1}
                    pageSize={PAGE_SIZE}
                    total={total}
                    onChange={currentPage => setCurrentPage(currentPage - 1)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </>
        )}
      </section>

      <Modal
        title={selectedProduct?.name || "商品详情"}
        open={Boolean(selectedProduct)}
        onCancel={() => setSelectedProduct(null)}
        footer={null}
        centered
      >
        {selectedProduct && (
          <div className={styles.detail}>
            {selectedProduct.mainImageUrl ? (
              <img
                className={styles.detailImage}
                src={resolveImageUrl(selectedProduct.mainImageUrl)}
                alt={selectedProduct.name}
              />
            ) : (
              <div className={styles.imagePlaceholder}>暂无主图</div>
            )}
            <p>
              <span>价格：</span>
              {selectedProduct.price !== undefined ? `￥${selectedProduct.price}` : "价格待定"}
            </p>
            <p>
              <span>状态：</span>
              {STATUS_LABELS[Number(selectedProduct.statusCode)] || "未知"}
            </p>
            <p>
              <span>成色：</span>
              {CONDITION_LABELS[Number(selectedProduct.conditionCode)] || "未知"}
            </p>
            <p>
              <span>购买日期：</span>
              {selectedProduct.purchasedAt || "未填写"}
            </p>
            <p>
              <span>分类：</span>
              {selectedProduct.category || "未分类"}
            </p>
            <p>
              <span>库存：</span>
              {selectedProduct.stock ?? 0}
            </p>
            <p>
              <span>描述：</span>
              {selectedProduct.description || "暂无描述"}
            </p>
          </div>
        )}
      </Modal>
    </main>
  );
}
