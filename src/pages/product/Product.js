import React, { useEffect, useState } from "react";
import Breadcrumbb from "../../components/breadcrumb/Breadcrumbb";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "../../components/product-card/ProductCard";
import Footer from "../../components/header-footer/Footer";
import MyNavbar from "../../components/header-footer/MyNavbar";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [totalPageArr, setTotalPageArr] = useState([]);
  const [displayPageArr, setDisplayPageArr] = useState([]);

  const [submenu, setSubmenu] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/product-service/product-type"
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setProductTypes(data.result || []);
      } catch (error) {
        console.error("Failed to fetch product types:", error);
      }
    };

    fetchProductTypes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/v1/product-service/product/page?page=${page}&size=8`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        const content = data.result?.content || [];
        const totalPages = data.result?.totalPages || 0;

        setProducts(content);

        const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
        setTotalPageArr(pagesArray);

        const startIndex = Math.max(0, page - 2);
        const endIndex = Math.min(totalPages, page + 3);
        setDisplayPageArr(pagesArray.slice(startIndex, endIndex));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [page]);

  useEffect(() => {
    let result = [...products];

    if (nameFilter === "name-inc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nameFilter === "name-dec") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (priceFilter === "price-inc") {
      result.sort(
        (a, b) =>
          a.price * (1 - a.discountPercent / 100) -
          b.price * (1 - b.discountPercent / 100)
      );
    } else if (priceFilter === "price-dec") {
      result.sort(
        (a, b) =>
          b.price * (1 - b.discountPercent / 100) -
          a.price * (1 - a.discountPercent / 100)
      );
    }

    setFilteredProducts(result);
  }, [nameFilter, priceFilter, products]);

  const handleFilterChange = (e) => {
    const value = e.target.value;

    if (value.startsWith("name")) {
      setNameFilter(value);
      setPriceFilter("");
    } else if (value.startsWith("price")) {
      setPriceFilter(value);
      setNameFilter("");
    } else {
      setNameFilter("");
      setPriceFilter("");
    }
  };

  return (
    <div>
      <MyNavbar />

      <Breadcrumbb
        name="Tất cả sản phẩm"
        page="Product"
        link="/product/all"
      />

      <Container className="product-page">
        <Row>
          <Col xl={2} lg={3} md={12}>
            <div className="product-sidebar">
              <div className="product-type-title">
                <span>Danh mục</span>
                <i
                  className={`fa-solid ${submenu ? "fa-minus" : "fa-plus"}`}
                  onClick={() => setSubmenu(!submenu)}
                />
              </div>

              <ul className={`product-type ${submenu ? "show" : "hidden"}`}>
                {productTypes.map((item) => (
                  <li key={item.id || item.productTypeId || item.name}>
                    <a href="#">{item.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col xl={10} lg={9} md={12}>
            <div className="product-content-header">
              <h4>Tất cả sản phẩm</h4>

              <select className="product-filter-select" onChange={handleFilterChange}>
                <option value="">Tất cả</option>
                <option value="name-inc">Tên: A-Z</option>
                <option value="name-dec">Tên: Z-A</option>
                <option value="price-inc">Giá: Thấp - Cao</option>
                <option value="price-dec">Giá: Cao - Thấp</option>
              </select>
            </div>

            <Row className="g-4">
              {filteredProducts.map((item) => (
                <Col
                  key={item.id || item.productId}
                  xs={6}
                  sm={6}
                  md={4}
                  lg={4}
                  xl={3}
                  className="d-flex"
                >
                  <ProductCard product={item} />
                </Col>
              ))}
            </Row>

            <Row>
              <Col className="text-center">
                <div className="pagination-wrapper">
                  <button
                    className="page-btn"
                    onClick={() => setPage(0)}
                    disabled={page === 0}
                  >
                    <i className="fa-solid fa-backward-fast"></i>
                  </button>

                  {displayPageArr.map((item) => (
                    <button
                      key={item}
                      className={`page-btn ${page + 1 === item ? "current" : ""}`}
                      onClick={() => setPage(item - 1)}
                    >
                      {item}
                    </button>
                  ))}

                  <button
                    className="page-btn"
                    onClick={() => setPage(totalPageArr.length - 1)}
                    disabled={page === totalPageArr.length - 1}
                  >
                    <i className="fa-solid fa-forward-fast"></i>
                  </button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Product;