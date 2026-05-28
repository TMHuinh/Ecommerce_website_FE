import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-support">
        <Container>
          <div className="support-content">
            <div className="support-icon">
              <i className="fa fa-phone"></i>
            </div>

            <span>Hỗ trợ / Mua hàng:</span>

            <a href="tel:0862642568">0862642568</a>
          </div>
        </Container>
      </div>

      <div className="footer-main">
        <Container>
          <Row className="gy-4">
            <Col xl={3} lg={3} md={6} xs={12}>
              <div className="footer-column">
                <h5>Giới thiệu</h5>

                <p>Hộ Kinh Doanh Bao GT</p>

                <p>
                  MST 8752797026-001 do UBND Q.Tân Bình cấp ngày 14/11/2022
                </p>

                <img
                  className="footer-bct-img"
                  src="//file.hstatic.net/200000312481/file/dathongbaobct_150_74a9d1876907440bb5f121381c6c6c0a_grande.png"
                  alt="Đã thông báo Bộ Công Thương"
                />
              </div>
            </Col>

            <Col xl={3} lg={3} md={6} xs={12}>
              <div className="footer-column footer-links">
                <h5>Liên kết</h5>

                <a href="/product/all">Tìm kiếm</a>
                <a href="/about">Giới thiệu</a>
                <a href="#">Chính sách thanh toán</a>
                <a href="#">Chính sách khiếu nại</a>
                <a href="#">Chính sách vận chuyển</a>
                <a href="#">Chính sách đổi trả</a>
                <a href="#">Chính sách bảo hành</a>
                <a href="#">Chính sách kiểm hàng</a>
                <a href="#">Chính sách bảo mật</a>
              </div>
            </Col>

            <Col xl={3} lg={3} md={6} xs={12}>
              <div className="footer-column">
                <h5>Thông tin liên hệ</h5>

                <div className="footer-contact-item">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>
                    22 Nguyễn Thái Học - Phường Tân Thành - Quận Tân Phú -
                    TP.Hồ Chí Minh
                  </span>
                </div>

                <div className="footer-contact-item">
                  <i className="fa-solid fa-mobile-screen-button"></i>
                  <span>0862642568</span>
                </div>

                <div className="footer-contact-item">
                  <i className="fa-solid fa-envelope"></i>
                  <span>outerity.local@gmail.com</span>
                </div>

                <div className="footer-contact-item">
                  <i className="fa-brands fa-telegram"></i>
                  <span>Outerity Official</span>
                </div>
              </div>
            </Col>

            <Col xl={3} lg={3} md={6} xs={12}>
              <div className="footer-column">
                <h5>Fanpage</h5>

                <div className="footer-fanpage">
                  <p>Theo dõi Outerity để cập nhật sản phẩm mới nhất.</p>

                  <div className="footer-socials">
                    <a href="#">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>

                    <a href="#">
                      <i className="fa-brands fa-instagram"></i>
                    </a>

                    <a href="#">
                      <i className="fa-brands fa-tiktok"></i>
                    </a>

                    <a href="#">
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <p>Copyright © 2024 Outerity. Powered by TKDYY</p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;