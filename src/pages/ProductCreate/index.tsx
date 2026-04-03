import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { productService } from "@/services";
import type {
  CreateProductParams,
  ProductConditionCode,
  ProductStatusCode,
} from "@/services/product/dto";
import styles from "./ProductCreate.module.css";

const CONDITION_OPTIONS: Array<{ label: string; value: ProductConditionCode }> = [
  { label: "全新", value: 1 },
  { label: "几乎全新", value: 2 },
  { label: "轻微使用痕迹", value: 3 },
  { label: "明显使用痕迹", value: 4 },
  { label: "成色较差", value: 5 },
  { label: "有瑕疵或异常", value: 6 },
];

const STATUS_OPTIONS: Array<{ label: string; value: ProductStatusCode }> = [
  { label: "上架", value: 1 },
  { label: "下架", value: 2 },
];

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  statusCode: ProductStatusCode;
  conditionCode: ProductConditionCode;
  purchasedAt: string;
  category: string;
  stock: string;
  mainImage: File | null;
  images: File[];
};

const INITIAL_FORM: ProductFormState = {
  name: "",
  description: "",
  price: "",
  statusCode: 1,
  conditionCode: 2,
  purchasedAt: "",
  category: "",
  stock: "1",
  mainImage: null,
  images: [],
};

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedImagesText = useMemo(() => {
    if (form.images.length === 0) {
      return "未选择附图";
    }
    return `已选择 ${form.images.length} 张附图`;
  }, [form.images.length]);

  const handleChange =
    (field: keyof ProductFormState) =>
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
        | ChangeEvent<HTMLSelectElement>,
    ) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));
      setError("");
    };

  const handleMainImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setForm((current) => ({ ...current, mainImage: file }));
    setError("");
  };

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setForm((current) => ({ ...current, images: files }));
    setError("");
  };

  const handleStatusCodeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setForm((current) => ({
      ...current,
      statusCode: Number(event.target.value) as ProductStatusCode,
    }));
    setError("");
  };

  const handleConditionCodeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setForm((current) => ({
      ...current,
      conditionCode: Number(event.target.value) as ProductConditionCode,
    }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("请输入商品名称");
      return;
    }

    if (!form.price.trim() || Number(form.price) <= 0) {
      setError("请输入有效价格");
      return;
    }

    if (!form.mainImage) {
      setError("请上传商品主图");
      return;
    }

    if (form.stock && Number(form.stock) < 0) {
      setError("库存不能为负数");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const params: CreateProductParams = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        statusCode: form.statusCode,
        conditionCode: form.conditionCode,
        purchasedAt: form.purchasedAt || undefined,
        category: form.category.trim() || undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        mainImage: form.mainImage,
        images: form.images,
      };

      const result = await productService.create(params);
      setForm(INITIAL_FORM);
      Modal.success({
        title: "发布成功",
        content: `商品上传成功（ID: ${result?.id ?? "-"}）`,
        okText: "返回个人页",
        centered: true,
        onOk: () => {
          navigate("/profile");
        },
        afterClose: () => {
          navigate("/profile");
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品上传失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1>上传商品</h1>
        <p className={styles.subTitle}>
          填写商品信息并上传图片。
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            商品名称 *
            <input value={form.name} onChange={handleChange("name")} />
          </label>

          <label>
            商品描述
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              rows={4}
            />
          </label>

          <div className={styles.row}>
            <label>
              价格 *
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange("price")}
              />
            </label>
            <label>
              数量
              <input
                type="number"
                min="1"
                step="1"
                value={form.stock}
                onChange={handleChange("stock")}
              />
            </label>
          </div>

          <div className={styles.row}>
            <label>
              商品状态 *
              <select value={form.statusCode} onChange={handleStatusCodeChange}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              成色 *
              <select value={form.conditionCode} onChange={handleConditionCodeChange}>
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label>
              购买日期
              <input
                type="date"
                value={form.purchasedAt}
                onChange={handleChange("purchasedAt")}
              />
            </label>
            <label>
              分类
              <input value={form.category} onChange={handleChange("category")} />
            </label>
          </div>

          <label>
            主图 *（仅 1 张）
            <input type="file" accept="image/*" onChange={handleMainImageChange} />
          </label>

          <label>
            附图（可选，多张）
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />
            <span className={styles.hint}>{selectedImagesText}</span>
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "上传中..." : "提交商品"}
          </button>
        </form>
      </section>
    </main>
  );
}
