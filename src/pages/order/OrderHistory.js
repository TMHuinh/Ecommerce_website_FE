import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import MyNavbar from "../../components/header-footer/MyNavbar";
import Footer from "../../components/header-footer/Footer";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "Không có ngày";

        const date =
            typeof dateValue === "string" && !dateValue.endsWith("Z")
                ? new Date(dateValue + "Z")
                : new Date(dateValue);

        return date.toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getStatusText = (status) => {
        switch (status) {
            case "PROCESSING":
                return "Đang xử lý";
            case "CONFIRMED":
                return "Đã xác nhận";
            case "SHIPPING":
                return "Đang giao hàng";
            case "COMPLETED":
                return "Hoàn thành";
            case "CANCELLED":
                return "Đã hủy";
            default:
                return status || "Không xác định";
        }
    };

    const getPaymentText = (payment) => {
        switch (payment) {
            case "PAID":
                return "Đã thanh toán";
            case "UNPAID":
                return "Chưa thanh toán";
            case "FAILED":
                return "Thanh toán thất bại";
            default:
                return payment || "Không xác định";
        }
    };

    useEffect(() => {
        const fetchOrderHistory = async () => {
            const token = localStorage.getItem("Access_Token");
            const accountID = localStorage.getItem("Account_ID");

            if (!token) {
                window.location.href = "/";
                return;
            }

            if (!accountID) {
                console.error("Không tìm thấy Account_ID trong localStorage");
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(
                    `http://localhost:8888/api/v1/order-service/account/${accountID}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data.result || []);
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    return (
        <div>
            <MyNavbar />

            <Container className="order-history-page">
                <div className="order-history-header">
                    <h2>Lịch sử mua hàng</h2>
                    <p>Xem lại các đơn hàng bạn đã đặt tại cửa hàng.</p>
                </div>

                {loading && (
                    <div className="order-history-message">
                        Đang tải đơn hàng...
                    </div>
                )}

                {!loading && orders.length === 0 && (
                    <div className="order-history-empty">
                        <i className="fa-solid fa-box-open"></i>
                        <h4>Bạn chưa có đơn hàng nào</h4>
                        <p>Hãy tiếp tục mua sắm để tạo đơn hàng đầu tiên.</p>
                        <a href="/product/all">Mua sắm ngay</a>
                    </div>
                )}

                {!loading &&
                    orders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div className="order-card-header">
                                <div>
                                    <h5>Mã đơn hàng: #{order.id}</h5>
                                    <span>{formatDate(order.dateCreated)}</span>
                                </div>

                                <div className="order-status">
                                    {getStatusText(order.status)}
                                </div>
                            </div>

                            <div className="order-info">
                                <Row>
                                    <Col md={6}>
                                        <p>
                                            <strong>Người nhận:</strong>{" "}
                                            {order.consigneeName || "Không có"}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {order.consigneeEmail || "Không có"}
                                        </p>
                                        <p>
                                            <strong>Số điện thoại:</strong>{" "}
                                            {order.consigneePhone || "Không có"}
                                        </p>
                                    </Col>

                                    <Col md={6}>
                                        <p>
                                            <strong>Địa chỉ:</strong>{" "}
                                            {order.address || "Không có"}
                                        </p>
                                        <p>
                                            <strong>Thanh toán:</strong>{" "}
                                            {getPaymentText(order.payment)}
                                        </p>
                                        <p>
                                            <strong>Tổng tiền:</strong>{" "}
                                            <span className="order-total">
                                                {formatCurrency(order.totalPrice)}
                                            </span>
                                        </p>
                                    </Col>
                                </Row>
                            </div>

                            <div className="order-detail-list">
                                <h6>Sản phẩm đã mua</h6>

                                {order.orderDetails && order.orderDetails.length > 0 ? (
                                    order.orderDetails.map((detail, index) => (
                                        <div className="order-detail-item" key={index}>
                                            <div>
                                                <p>
                                                    <strong>Mã sản phẩm:</strong>{" "}
                                                    {detail.productID || "Không có"}
                                                </p>
                                                <span>
                                                    Size: {detail.size || "Không có"} | Màu:{" "}
                                                    {detail.color || "Không có"}
                                                </span>
                                            </div>

                                            <div className="order-detail-quantity">
                                                x{detail.quantity || 0}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="order-detail-empty">
                                        Không có sản phẩm trong đơn hàng.
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
            </Container>

            <Footer />
        </div>
    );
};

export default OrderHistory;