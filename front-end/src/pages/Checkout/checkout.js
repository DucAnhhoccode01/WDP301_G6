import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/slices/orebi.slice";
import ItemCard from "./ItemCard";
import OrderService from '../../services/api/OrderService';
import { FaShippingFast, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import "./Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.orebiReducer.products);
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [billingInfo, setBillingInfo] = useState({
    userId: userInfo._id || null,
    fullName: userInfo.fullName || "",
    address: userInfo.address || "",
    email: userInfo.email || "",
    phoneNumber: userInfo.phoneNumber || ""
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const isLoggedIn = !!localStorage.getItem('accessToken');

  useEffect(() => {
    let price = 0;
    products.forEach((item) => {
      price += item.price * item.quantity;
    });
    setTotalAmt(price);
  }, [products]);

  useEffect(() => {
    if (totalAmt <= 200) setShippingCharge(0);
    else if (totalAmt <= 400) setShippingCharge(0);
    else setShippingCharge(0);
  }, [totalAmt]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({
      ...billingInfo,
      [name]: value,
    });
  };

  const handlePlaceOrder = async () => {
    if (!billingInfo.fullName || !billingInfo.phoneNumber) {
      alert('Please fill out all required fields.');
      return;
    }

    const orderData = {
      userId: billingInfo.userId || null,
      items: products.map(product => ({
        productId: product._id,
        salePrice: product.price,
        saleCost: product.price * 0.8,
        quantity: product.quantity,
        color: product.color || 'Unknown',
      })),
      shippingFee: shippingCharge,
      paymentMethod: paymentMethod,
      contactInfo: {
        name: billingInfo.fullName,
        phone: billingInfo.phoneNumber,
        email: billingInfo.email,
        address: billingInfo.address
      }
    };

    try {
      if (paymentMethod === 'Cash On Delivery') {
        await OrderService.createOrder(orderData);
        alert("Your order has been placed successfully!");
        dispatch(resetCart());
        navigate("/order-history");
      } else if (paymentMethod === 'VnPay') {
        const paymentUrlData = await OrderService.createPaymentUrl({ ...orderData });
        window.location.href = paymentUrlData.vnpUrl;
      } else if (paymentMethod === 'PayPal') {
        alert("PayPal payment is not supported yet.");
      }
    } catch (error) {
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <div className="checkout-container bg-gradient-to-br from-green-50 to-white min-h-screen">
      <Breadcrumbs title="Checkout" />
      {products.length > 0 ? (
        <div className="checkout-content flex flex-col md:flex-row gap-8">
          <div className="checkout-left flex-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Thông tin vận chuyển</h2>
            {!isLoggedIn && (
              <p className="mb-2 text-sm text-blue-600">
                Bạn đã có tài khoản? <Link to="/signin" className="underline">Đăng nhập</Link>
              </p>
            )}
            <form className="billing-form flex flex-col gap-3">
              <input
                type="text"
                name="fullName"
                value={billingInfo.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                value={billingInfo.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="phoneNumber"
                value={billingInfo.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="address"
                value={billingInfo.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="border rounded px-3 py-2"
              />
            </form>
            <div className="payment-method mt-6">
              <h2 className="text-xl font-semibold mb-2 text-green-700">Phương thức thanh toán</h2>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash On Delivery"
                    checked={paymentMethod === 'Cash On Delivery'}
                    onChange={() => setPaymentMethod('Cash On Delivery')}
                  />
                  <FaMoneyBillWave className="text-green-500" /> Thanh toán khi nhận hàng
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="VnPay"
                    checked={paymentMethod === 'VnPay'}
                    onChange={() => setPaymentMethod('VnPay')}
                  />
                  <FaCreditCard className="text-blue-500" /> VNPay
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="PayPal"
                    checked={paymentMethod === 'PayPal'}
                    onChange={() => setPaymentMethod('PayPal')}
                  />
                  <FaCreditCard className="text-yellow-500" /> PayPal
                </label>
              </div>
            </div>
          </div>
          <div className="checkout-right w-full md:w-96 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Tóm tắt đơn hàng</h2>
            <div className="order-items max-h-60 overflow-y-auto mb-4">
              {products.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
            <div className="order-total border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Tổng phụ:</span>
                <span className="font-semibold text-green-700">{totalAmt} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-green-700">{shippingCharge} VND</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-green-800">{totalAmt + shippingCharge} VND</span>
              </div>
            </div>
            <div className="discount-code mt-4 flex gap-2">
              <input type="text" placeholder="Discount code" className="border rounded px-3 py-2 flex-1" />
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition">Áp dụng</button>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded shadow hover:from-green-600 hover:to-green-800 transition"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="empty-cart flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="empty-cart-content text-center">
            <h1 className="text-2xl font-bold mb-2 text-green-700">Giỏ hàng của bạn đang trống.</h1>
            <p className="mb-4 text-gray-600">Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng. Hãy tiếp tục mua sắm để tìm những món ăn ngon!</p>
            <Link to="/shop">
              <button className="bg-green-500 rounded-md px-8 py-2 text-white font-semibold hover:bg-green-700 transition">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Checkout;