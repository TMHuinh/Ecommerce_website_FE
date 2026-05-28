import React, { useState } from "react";
import MyNavbar from "../../components/header-footer/MyNavbar";
import Footer from "../../components/header-footer/Footer";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact form data:", formData);

    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");

    setFormData({
      fullname: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div>
      <MyNavbar />

      <section className="contact-banner">
        <div className="contact-banner-content">
          <h1>Contact Us</h1>
          <p>Liên hệ với Outerity để được hỗ trợ nhanh chóng.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Thông tin liên hệ</h2>
            <p>
              Nếu bạn có thắc mắc về sản phẩm, đơn hàng hoặc chính sách mua
              hàng, hãy liên hệ với chúng tôi.
            </p>

            <div className="contact-info-item">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <h4>Địa chỉ</h4>
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>

            <div className="contact-info-item">
              <i className="fa-solid fa-phone"></i>
              <div>
                <h4>Số điện thoại</h4>
                <span>0123 456 789</span>
              </div>
            </div>

            <div className="contact-info-item">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <span>outerityshop@gmail.com</span>
              </div>
            </div>

            <div className="contact-info-item">
              <i className="fa-solid fa-clock"></i>
              <div>
                <h4>Thời gian làm việc</h4>
                <span>Thứ 2 - Chủ nhật: 8:00 - 21:00</span>
              </div>
            </div>
          </div>

          <div className="contact-form-box">
            <h2>Gửi tin nhắn</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung cần liên hệ"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                Gửi liên hệ
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <iframe
          title="Outerity Map"
          src="https://www.google.com/maps?q=Ho%20Chi%20Minh%20City,%20Vietnam&output=embed"
          loading="lazy"
        ></iframe>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;