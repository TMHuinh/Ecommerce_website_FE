import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const createSlug = (str = "") => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    const discountedPrice =
      originalPrice - (originalPrice * discountPercent) / 100;

    return formatCurrency(discountedPrice);
  };

  const imageURL = product?.variants?.[0]?.imageURL;

  return (
    <a href={`/product/${createSlug(product.name)}`} className="product-card">
      <div className="product-card-image">
        <img src={imageURL} alt={product.name} />
      </div>

      {product.discountPercent > 0 && (
        <div className="product-discount">
          <span>-{product.discountPercent}%</span>
        </div>
      )}

      <div className="product-info">
        <strong className="product-name">{product.name}</strong>

        <div className="product-price">
          <span className="sale-price">
            {calculateDiscountedPrice(product.price, product.discountPercent)}
          </span>

          {product.discountPercent > 0 && (
            <del className="old-price">{formatCurrency(product.price)}</del>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProductCard;