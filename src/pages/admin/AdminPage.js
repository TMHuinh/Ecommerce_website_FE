import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import MyNavbar from "../../components/header-footer/MyNavbar";
import Footer from "../../components/header-footer/Footer";
import FormLogin from "../../components/form-login/FormLogin";
import { showNotification } from "../../components/utils/Notification";
import "./AdminPage.css";

const API_BASE = "http://localhost:8888/api/v1/product-service";
const emptyVariant = {
  size: "S",
  color: "",
  imageURL: "",
  inventoryQuantity: 0,
};
const emptyProductForm = {
  name: "",
  price: "",
  discountPercent: 0,
  description: "",
  productType: "",
  variants: [{ ...emptyVariant }],
};
const emptyTypeForm = {
  name: "",
  description: "",
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [typeForm, setTypeForm] = useState(emptyTypeForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("Access_Token");
  const authHeaders = useMemo(
    () => ({
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    }),
    [token]
  );

  const fetchProducts = useCallback(async () => {
    const response = await axios.get(`${API_BASE}/product`);
    setProducts(response.data.result || []);
  }, []);

  const fetchProductTypes = useCallback(async () => {
    const response = await axios.get(`${API_BASE}/product-type`);
    setProductTypes(response.data.result || []);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProducts(), fetchProductTypes()]);
    } catch (error) {
      console.error(error);
      showNotification("Khong tai duoc du lieu admin");
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchProductTypes]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!productForm.productType && productTypes.length > 0) {
      setProductForm((current) => ({
        ...current,
        productType: productTypes[0].id,
      }));
    }
  }, [productForm.productType, productTypes]);

  const getTypeName = (typeId) => {
    return productTypes.find((type) => type.id === typeId)?.name || typeId;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value || 0));
  };

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProductForm((current) => {
      const variants = current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      );
      return { ...current, variants };
    });
  };

  const addVariant = () => {
    setProductForm((current) => ({
      ...current,
      variants: [...current.variants, { ...emptyVariant }],
    }));
  };

  const removeVariant = (index) => {
    setProductForm((current) => ({
      ...current,
      variants:
        current.variants.length === 1
          ? [{ ...emptyVariant }]
          : current.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({
      ...emptyProductForm,
      productType: productTypes[0]?.id || "",
      variants: [{ ...emptyVariant }],
    });
  };

  const resetTypeForm = () => {
    setEditingTypeId(null);
    setTypeForm(emptyTypeForm);
  };

  const buildProductPayload = () => ({
    ...productForm,
    price: Number(productForm.price),
    discountPercent: Number(productForm.discountPercent),
    variants: productForm.variants.map((variant) => ({
      ...variant,
      inventoryQuantity: Number(variant.inventoryQuantity),
    })),
  });

  const validateProduct = () => {
    if (!productForm.name.trim()) return "Vui long nhap ten san pham";
    if (!productForm.productType) return "Vui long chon loai san pham";
    if (Number(productForm.price) <= 0) return "Gia san pham phai lon hon 0";
    const invalidVariant = productForm.variants.some(
      (variant) => !variant.color.trim() || !variant.imageURL.trim()
    );
    if (invalidVariant) return "Moi bien the can co mau va hinh anh";
    return "";
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    const validationMessage = validateProduct();
    if (validationMessage) {
      showNotification(validationMessage);
      return;
    }

    setSaving(true);
    try {
      const payload = buildProductPayload();
      if (editingProductId) {
        await axios.put(`${API_BASE}/product/${editingProductId}`, payload, authHeaders);
        showNotification("Da cap nhat san pham");
      } else {
        await axios.post(`${API_BASE}/product`, payload, authHeaders);
        showNotification("Da them san pham");
      }
      resetProductForm();
      await fetchProducts();
    } catch (error) {
      console.error(error);
      showNotification("Luu san pham that bai");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setActiveTab("products");
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      price: product.price || "",
      discountPercent: product.discountPercent || 0,
      description: product.description || "",
      productType: product.productType || productTypes[0]?.id || "",
      variants:
        product.variants?.length > 0
          ? product.variants.map((variant) => ({
              size: variant.size || "S",
              color: variant.color || "",
              imageURL: variant.imageURL || "",
              inventoryQuantity: variant.inventoryQuantity || 0,
            }))
          : [{ ...emptyVariant }],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Xoa san pham nay?")) return;
    try {
      await axios.delete(`${API_BASE}/product/${productId}`, authHeaders);
      showNotification("Da xoa san pham");
      await fetchProducts();
      if (editingProductId === productId) resetProductForm();
    } catch (error) {
      console.error(error);
      showNotification("Xoa san pham that bai");
    }
  };

  const submitType = async (event) => {
    event.preventDefault();
    if (!typeForm.name.trim()) {
      showNotification("Vui long nhap ten loai san pham");
      return;
    }

    setSaving(true);
    try {
      if (editingTypeId) {
        await axios.put(`${API_BASE}/product-type/${editingTypeId}`, typeForm, authHeaders);
        showNotification("Da cap nhat loai san pham");
      } else {
        await axios.post(`${API_BASE}/product-type`, typeForm, authHeaders);
        showNotification("Da them loai san pham");
      }
      resetTypeForm();
      await fetchProductTypes();
    } catch (error) {
      console.error(error);
      showNotification("Luu loai san pham that bai");
    } finally {
      setSaving(false);
    }
  };

  const editType = (type) => {
    setActiveTab("types");
    setEditingTypeId(type.id);
    setTypeForm({
      name: type.name || "",
      description: type.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteType = async (typeId) => {
    if (!window.confirm("Xoa loai san pham nay?")) return;
    try {
      await axios.delete(`${API_BASE}/product-type/${typeId}`, authHeaders);
      showNotification("Da xoa loai san pham");
      await fetchProductTypes();
      if (editingTypeId === typeId) resetTypeForm();
    } catch (error) {
      console.error(error);
      showNotification("Xoa loai san pham that bai");
    }
  };

  return (
    <div>
      <MyNavbar />
      <FormLogin />
      <main className="admin-page">
        <div className="admin-shell">
          <section className="admin-header">
            <div>
              <p>Bang dieu khien</p>
              <h1>Quan ly san pham</h1>
            </div>
            <div className="admin-stats">
              <span>{products.length} san pham</span>
              <span>{productTypes.length} loai</span>
            </div>
          </section>

          <div className="admin-tabs" role="tablist">
            <button
              className={activeTab === "products" ? "active" : ""}
              onClick={() => setActiveTab("products")}
              type="button"
            >
              <i className="fa-solid fa-shirt"></i>
              San pham
            </button>
            <button
              className={activeTab === "types" ? "active" : ""}
              onClick={() => setActiveTab("types")}
              type="button"
            >
              <i className="fa-solid fa-layer-group"></i>
              Loai san pham
            </button>
          </div>

          {!token && (
            <div className="admin-warning">
              Can dang nhap tai khoan co quyen quan tri de them, sua, xoa du lieu.
            </div>
          )}

          {activeTab === "products" ? (
            <section className="admin-grid">
              <div className="admin-panel">
                <div className="admin-panel-title">
                  <h2>{editingProductId ? "Sua san pham" : "Them san pham"}</h2>
                  {editingProductId && (
                    <button type="button" className="ghost-btn" onClick={resetProductForm}>
                      Huy sua
                    </button>
                  )}
                </div>

                <form className="admin-form" onSubmit={submitProduct}>
                  <label>
                    Ten san pham
                    <input name="name" value={productForm.name} onChange={handleProductChange} />
                  </label>
                  <div className="form-row">
                    <label>
                      Gia
                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={productForm.price}
                        onChange={handleProductChange}
                      />
                    </label>
                    <label>
                      Giam gia (%)
                      <input
                        name="discountPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={productForm.discountPercent}
                        onChange={handleProductChange}
                      />
                    </label>
                  </div>
                  <label>
                    Loai san pham
                    <select
                      name="productType"
                      value={productForm.productType}
                      onChange={handleProductChange}
                    >
                      {productTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Mo ta
                    <textarea
                      name="description"
                      rows="4"
                      value={productForm.description}
                      onChange={handleProductChange}
                    />
                  </label>

                  <div className="variant-head">
                    <h3>Bien the</h3>
                    <button type="button" className="ghost-btn" onClick={addVariant}>
                      <i className="fa-solid fa-plus"></i>
                      Them bien the
                    </button>
                  </div>

                  {productForm.variants.map((variant, index) => (
                    <div className="variant-box" key={`${variant.size}-${index}`}>
                      <div className="form-row">
                        <label>
                          Size
                          <select
                            value={variant.size}
                            onChange={(event) =>
                              handleVariantChange(index, "size", event.target.value)
                            }
                          >
                            {["S", "M", "L", "X", "XL", "XXL"].map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Ton kho
                          <input
                            type="number"
                            min="0"
                            value={variant.inventoryQuantity}
                            onChange={(event) =>
                              handleVariantChange(
                                index,
                                "inventoryQuantity",
                                event.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                      <label>
                        Mau
                        <input
                          value={variant.color}
                          onChange={(event) =>
                            handleVariantChange(index, "color", event.target.value)
                          }
                        />
                      </label>
                      <label>
                        Link hinh anh
                        <input
                          value={variant.imageURL}
                          onChange={(event) =>
                            handleVariantChange(index, "imageURL", event.target.value)
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="danger-link"
                        onClick={() => removeVariant(index)}
                      >
                        Xoa bien the
                      </button>
                    </div>
                  ))}

                  <button className="primary-btn" type="submit" disabled={saving}>
                    {saving ? "Dang luu..." : editingProductId ? "Cap nhat san pham" : "Them san pham"}
                  </button>
                </form>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-title">
                  <h2>Danh sach san pham</h2>
                  <button type="button" className="ghost-btn" onClick={loadData}>
                    <i className="fa-solid fa-rotate"></i>
                    Tai lai
                  </button>
                </div>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>San pham</th>
                        <th>Loai</th>
                        <th>Gia</th>
                        <th>Kho</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5">Dang tai...</td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id}>
                            <td>
                              <div className="product-cell">
                                <img src={product.variants?.[0]?.imageURL} alt="" />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td>{getTypeName(product.productType)}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>
                              {product.variants?.reduce(
                                (total, item) => total + Number(item.inventoryQuantity || 0),
                                0
                              )}
                            </td>
                            <td className="table-actions">
                              <button type="button" onClick={() => editProduct(product)}>
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button type="button" onClick={() => deleteProduct(product.id)}>
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            <section className="admin-grid type-grid">
              <div className="admin-panel">
                <div className="admin-panel-title">
                  <h2>{editingTypeId ? "Sua loai san pham" : "Them loai san pham"}</h2>
                  {editingTypeId && (
                    <button type="button" className="ghost-btn" onClick={resetTypeForm}>
                      Huy sua
                    </button>
                  )}
                </div>
                <form className="admin-form" onSubmit={submitType}>
                  <label>
                    Ten loai
                    <input
                      name="name"
                      value={typeForm.name}
                      onChange={(event) =>
                        setTypeForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Mo ta
                    <textarea
                      rows="5"
                      value={typeForm.description}
                      onChange={(event) =>
                        setTypeForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <button className="primary-btn" type="submit" disabled={saving}>
                    {saving ? "Dang luu..." : editingTypeId ? "Cap nhat loai" : "Them loai"}
                  </button>
                </form>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-title">
                  <h2>Danh sach loai san pham</h2>
                  <button type="button" className="ghost-btn" onClick={fetchProductTypes}>
                    <i className="fa-solid fa-rotate"></i>
                    Tai lai
                  </button>
                </div>
                <div className="type-list">
                  {productTypes.map((type) => (
                    <article key={type.id} className="type-item">
                      <div>
                        <h3>{type.name}</h3>
                        <p>{type.description || "Chua co mo ta"}</p>
                      </div>
                      <div className="table-actions">
                        <button type="button" onClick={() => editType(type)}>
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" onClick={() => deleteType(type.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
