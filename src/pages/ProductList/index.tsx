import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Spin, Pagination, Button } from "antd";
import { productService, UserProfile, userService, chatService } from "@/services";
import { resolveImageUrl } from "@/config";
import type { ProductListItem, ProductListPageData, ConditionCode } from "@/services/product/dto";
import styles from "./ProductList.module.css";

const PAGE_SIZE = 8;

const CONDITION_OPTIONS = [
  { value: 1, label: "全新" },
  { value: 2, label: "几乎全新" },
  { value: 3, label: "轻微使用痕迹" },
  { value: 4, label: "明显使用痕迹" },
  { value: 5, label: "成色较差" },
  { value: 6, label: "有瑕疵或异常" },
];

const CONDITION_LABELS: Record<number, string> = {
  1: "全新",
  2: "几乎全新",
  3: "轻微使用痕迹",
  4: "明显使用痕迹",
  5: "成色较差",
  6: "有瑕疵或异常",
};

const normalizeListPage = (payload: unknown): ProductListPageData => {
  if (payload && typeof payload === "object") {
    const obj = payload as Partial<ProductListPageData>;
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

export default function ProductListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [conditionCode, setConditionCode] = useState<ConditionCode | undefined>();
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedConditionCode, setAppliedConditionCode] = useState<
    ConditionCode | undefined
  >();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [searchNonce, setSearchNonce] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await productService.list({
          keyword: appliedKeyword || undefined,
          conditionCode: appliedConditionCode,
          current: currentPage,
          pageSize,
        });
        const normalized = normalizeListPage(response);
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

    run();

    return () => {
      cancelled = true;
    };
  }, [appliedKeyword, appliedConditionCode, currentPage, pageSize, searchNonce]);

  const handleSearch = () => {
    setAppliedKeyword(keyword.trim());
    setAppliedConditionCode(conditionCode);
    setCurrentPage(0);
    setSearchNonce((n) => n + 1);
  };

  useEffect( () => {
    const fetchProfile = async () => {
      const response = await userService.getMyProfile();
      setProfile(response);
    }
    fetchProfile();
  }, []);

  const handleConditionChange = (value: ConditionCode | undefined) => {
    setConditionCode(value);
  };

  const hasData = useMemo(() => products.length > 0, [products]);

  const handleIWant = async (productId: number) => {
    try {
      const response = await chatService.createChat({ productId });
      navigate(`/chat/${response.id}`);
    } catch (err) {
      console.error('创建聊天失败', err);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <h1>闲置商品</h1>

        <div className={styles.filters}>
          <Input
            placeholder="搜索商品名称"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={styles.keywordInput}
          />
          <Select
            placeholder="选择成色"
            value={conditionCode}
            onChange={handleConditionChange}
            allowClear
            className={styles.conditionSelect}
            options={CONDITION_OPTIONS}
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
        </div>

        {loading && <Spin className={styles.spinner} />}
        {error && !loading && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <>
            {!hasData ? (
              <p className={styles.tip}>暂无商品</p>
            ) : (
              <>
                <div className={styles.grid}>
                  {products.map((product) => (
                    <div key={product.id} className={styles.card}>
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
                        {CONDITION_LABELS[Number(product.conditionCode)] || "未知成色"}
                      </p>
                      {
                        product.ownerUsername !== profile?.username && <div className={styles.actions}>
                        <Button size="small" onClick={() => handleIWant(product.id)}>我想要</Button>
                      </div>
                       }
                    </div>
                  ))}
                </div>

                <div className={styles.pagination}>
                  <Pagination
                    current={currentPage + 1}
                    pageSize={pageSize}
                    total={total}
                    onChange={(page) => setCurrentPage(page - 1)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}