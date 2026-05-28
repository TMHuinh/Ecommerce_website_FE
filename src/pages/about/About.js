import React from "react";
import MyNavbar from "../../components/header-footer/MyNavbar";
import Footer from "../../components/header-footer/Footer";
import "./About.css";

const About = () => {
  return (
    <div>
      <MyNavbar />

      <section className="about-banner">
        <div className="about-banner-content">
          <h1>About Outerity</h1>
          <p>Thời trang trẻ trung, năng động và cá tính dành cho bạn.</p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="about-content">
            <h2>Giới thiệu về chúng tôi</h2>
            <p>
              Outerity là cửa hàng thời trang hướng đến phong cách hiện đại,
              tối giản nhưng vẫn nổi bật. Chúng tôi cung cấp các sản phẩm như
              áo thun, áo hoodie, quần jean và nhiều bộ sưu tập phù hợp với
              giới trẻ.
            </p>

            <p>
              Mục tiêu của Outerity là mang đến cho khách hàng những sản phẩm
              chất lượng, thiết kế đẹp, dễ phối đồ và phù hợp với nhiều hoàn
              cảnh khác nhau như đi học, đi chơi, đi làm hoặc gặp gỡ bạn bè.
            </p>
          </div>

          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
              alt="Outerity fashion store"
            />
          </div>
        </div>
      </section>

      <section className="about-values">
        <h2>Giá trị của chúng tôi</h2>

        <div className="about-value-list">
          <div className="about-value-card">
            <i className="fa-solid fa-shirt"></i>
            <h4>Thời trang</h4>
            <p>Sản phẩm được chọn lọc theo xu hướng trẻ trung và hiện đại.</p>
          </div>

          <div className="about-value-card">
            <i className="fa-solid fa-star"></i>
            <h4>Chất lượng</h4>
            <p>Cam kết mang đến sản phẩm có chất liệu tốt và thoải mái.</p>
          </div>

          <div className="about-value-card">
            <i className="fa-solid fa-truck-fast"></i>
            <h4>Dịch vụ</h4>
            <p>Hỗ trợ khách hàng nhanh chóng, giao hàng tiện lợi.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;