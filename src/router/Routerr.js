import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "../pages/home/Home";
import ProductDetail from "../pages/productdetail/ProductDetail";
import Product from "../pages/product/Product";
import CartPage from "../pages/cart/CartPage";
import OrderPage from "../pages/order/OrderPage";
import PaymentResult from "../components/payment/PaymentResult";
import SuccessPayment from "../components/payment/SuccessPayment";
import FailedPayment from "../components/payment/FailPayment";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import OrderHistory from "../pages/order/OrderHistory";

const Routerr = () => {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
    { path: "/product/:id", element: <ProductDetail /> },
    { path: "/product/all", element: <Product /> },
    { path: "/order", element: <OrderPage /> },
    { path: "/payment-result", element: <PaymentResult /> },
    { path: "/payment-success", element: <SuccessPayment /> },
    { path: "/payment-fail", element: <FailedPayment /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/order-history", element: <OrderHistory /> },
  ]);

  return routes;
};

export default Routerr;