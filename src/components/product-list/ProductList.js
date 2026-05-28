import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "../product-card/ProductCard";
import "./ProductList.css";

const ProductList = ({ title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/product-service/product",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.result || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="product-list-section">
      <Container>
        <div className="product-list-header">
          <h2>{title}</h2>
          <div className="product-title-line"></div>
        </div>

        <Row className="g-4 justify-content-center">
          {products.map((product) => (
            <Col
              key={product.id || product.productId}
              xs={6}
              sm={6}
              md={4}
              lg={3}
              className="d-flex"
            >
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
        <div className="product-more">
          <a href="/product/all" className="product-more-btn">
            XEM THÊM
          </a>
        </div>
      </Container>
    </section>
  );
};

export default ProductList;