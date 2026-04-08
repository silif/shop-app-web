import { useState } from 'react';
import { Button, message } from 'antd';
import { ConversationProductInfo, productService } from '@/services';
import { resolveImageUrl } from '@/config';
import styles from './ChatProductDetail.module.css';

type ChatProductDetailProps = {
  productDetail: ConversationProductInfo;
  isSeller: boolean;
  onFresh?: () => void;
}

const CONDITION_LABELS: Record<number, string> = {
  1: "全新",
  2: "几乎全新",
  3: "轻微使用痕迹",
  4: "明显使用痕迹",
  5: "成色较差",
  6: "有瑕疵或异常",
};

export default function ChatProductDetail({ productDetail, isSeller, onFresh }: ChatProductDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!productDetail) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>商品不存在</p>
      </div>
    );
  }

  const images = productDetail.imageUrls && productDetail.imageUrls.length > 0
    ? productDetail.imageUrls
    : productDetail.mainImageUrl
      ? [productDetail.mainImageUrl]
      : [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = productDetail.statusCode === 1 ? 2 : 1;
      await productService.update(productDetail.id, { statusCode: newStatus,productId: productDetail.id });
      message.success(newStatus === 2 ? '已设为预定' : '已设为在售');
      onFresh?.();
    } catch (err) {
      message.error('设置失败');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>商品详情</h2>

      {images.length > 0 ? (
        <div className={styles.imageWrapper}>
          <div className={styles.mainImage}>
            <img src={resolveImageUrl(images[currentIndex])} alt={productDetail.name} />
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
        <h3 className={styles.name}>{productDetail.name}</h3>
        <p className={styles.price}>
          {productDetail.price !== undefined ? `￥${productDetail.price}` : "价格待定"}
        </p>
        {productDetail.conditionCode && (
          <p className={styles.condition}>
            成色：{CONDITION_LABELS[productDetail.conditionCode] || "未知"}
          </p>
        )}
        {productDetail.description && (
          <p className={styles.description}>{productDetail.description}</p>
        )}
      </div>

      {isSeller && (
         <div className={styles.footer}>
         <Button
           className={styles.reserveBtn}
           onClick={handleToggleStatus}
           block={true}
           type={productDetail.statusCode === 1 ? 'primary' : 'default'}
         >
           {productDetail.statusCode === 1 ? '设为预定' : '设为在售'}
         </Button>
       </div>
      )}
    </div>
  );
}