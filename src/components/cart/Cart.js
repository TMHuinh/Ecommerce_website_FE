import React, { useEffect, useState } from "react";
import "./Cart.css";
import CartItem from "./CartItem";
import CartInfo from "./CartInfo";
import axios from "axios";

const Cart = () => {
  const token = localStorage.getItem("Access_Token");
  const accountID = localStorage.getItem("Account_ID");

  const [cartItems, setCartItems] = useState([]);
  const [cartItemsSelected, setCartItemsSelected] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (!token || !accountID) {
      console.warn("Chưa đăng nhập, không thể tải giỏ hàng.");
      return;
    }

    axios
      .get(`http://localhost:8888/api/v1/cart-service/cart/get/${accountID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.code === 1000) {
          const items = response.data.result.items;
          setCartItems(items);
        } else {
          console.error("Lỗi khi gọi api cart:", response.data);
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching cart info:",
          error.response || error.message
        );
      });
  }, [accountID, token]);

  const handleDelete = (productID, color, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.productID === productID && item.color === color && item.size === size)
      )
    );

    setCartItemsSelected((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.productID === productID && item.color === color && item.size === size)
      )
    );
  };

  const handleChangeQuantity = (productID, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productID === productID ? { ...item, quantity: newQuantity } : item
      )
    );
    setCartItemsSelected((prevItems) =>
      prevItems.map((item) =>
        item.productID === productID ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSelectAllItem = (event) => {
    if (event.target.checked) {
      setIsAllSelected(true);
      setCartItemsSelected(cartItems);
    } else {
      setIsAllSelected(false);
      setCartItemsSelected([]);
    }
  };

  const handleSelectItem = (productID, color, size, isSelected) => {
    setIsAllSelected(
      isSelected && cartItemsSelected.length + 1 === cartItems.length
    );

    if (isSelected === true) {
      const updatedSelectedItems = cartItems.filter(
        (item) =>
          item.productID === productID &&
          item.color === color &&
          item.size === size
      );

      setCartItemsSelected((prevSelectedItems) => [
        ...prevSelectedItems,
        ...updatedSelectedItems,
      ]);
    } else {
      // FIX LỖI: Chỉ uncheck đúng sản phẩm trùng size/màu
      setCartItemsSelected((prevSelectedItems) =>
        prevSelectedItems.filter(
          (item) =>
            !(item.productID === productID && item.color === color && item.size === size)
        )
      );
    }
  };

  // TÍNH TỔNG TIỀN DUY NHẤT TẠI ĐÂY (Áp dụng đúng % khuyến mãi)
  useEffect(() => {
    const newTotalPrice = cartItemsSelected.reduce(
      (acc, item) => {
        const discount = item.discountPercent || 0;
        const priceAfterDiscount = item.productPrice * (1 - discount / 100);
        return acc + (priceAfterDiscount * item.quantity);
      },
      0
    );
    setTotalPrice(newTotalPrice);
  }, [cartItemsSelected]);

  return (
    <div className="p-3">
      <div className="cart-title-container mb-2">
        <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>
          GIỎ HÀNG ({cartItems.length} sản phẩm)
        </span>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-navbar-container ">
            <div className="cart-navbar-checkbox">
              <input
                type="checkbox"
                className="form-check-input me-3"
                style={{ border: "1px solid black", cursor: "pointer" }}
                checked={isAllSelected}
                onChange={handleSelectAllItem}
              />
              <span style={{ fontWeight: "500" }}>Chọn tất cả</span>
            </div>
            <div className="cart-navbar-quantity">
              <span style={{ fontWeight: "500" }}>Số lượng</span>
            </div>
            <div className="cart-navbar-price">
              <span style={{ fontWeight: "500" }}>Giá tiền</span>
            </div>
          </div>
          <hr className="m-3"></hr>
          <div className="cart-items-block">
            {cartItems.map((item, index) => (
              <React.Fragment key={index}>
                <CartItem
                  productID={item.productID}
                  productName={item.productName}
                  productImage={item.productImage}
                  size={item.size}
                  color={item.color}
                  productPrice={item.productPrice}
                  quantity={item.quantity}
                  inventoryQuantity={item.inventoryQuantity}
                  discountPercent={item.discountPercent || 0}
                  onDelete={handleDelete}
                  onQuantityChange={handleChangeQuantity}
                  selected={handleSelectItem}
                  isChecked={cartItemsSelected.some(
                    (selectedItem) =>
                      selectedItem.productID === item.productID &&
                      selectedItem.color === item.color &&
                      selectedItem.size === item.size
                  )}
                />
                {index < cartItems.length - 1 && (
                  <hr
                    style={{
                      margin: "8px 18px",
                      color: "rgb(153 153 153)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="cart-info-container">
          <CartInfo
            total={totalPrice}
            orderedProducts={cartItemsSelected}
            shippingFee={20000}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;