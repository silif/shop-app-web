import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { ConversationProductInfo, productService } from '@/services';
import { resolveImageUrl } from '@/config';
import type { ProductDetail } from '@/services/product/dto';
import styles from './ChatProductDetail.module.css';

type ChatProductDetailProps = {
  product: ConversationProductInfo;
}

const CONDITION_LABELS: Record<number, string> = {
  1: "全新",
  2: "几乎全新",
  3: "轻微使用痕迹",
  4: "明显使用痕迹",
  5: "成色较差",
  6: "有瑕疵或异常",
};

export default function ChatProductDetail({product} : ChatProductDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>商品不存在</p>
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : product.mainImageUrl
      ? [product.mainImageUrl]
      : [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>商品详情</h2>

      {images.length > 0 ? (
        <div className={styles.imageWrapper}>
          <div className={styles.mainImage}>
            <img src={resolveImageUrl(images[currentIndex])} alt={product.name} />
            {images.length > 1 && (
              <>
                <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev}>
                  ‹
                </button>
                <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext}>
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((url, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img src={resolveImageUrl(url)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.imagePlaceholder}>暂无图片</div>
      )}

      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>
          {product.price !== undefined ? `￥${product.price}` : "价格待定"}
        </p>
        {product.conditionCode && (
          <p className={styles.condition}>
            成色：{CONDITION_LABELS[product.conditionCode] || "未知"}
          </p>
        )}
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
      </div>
    </div>
  );
}