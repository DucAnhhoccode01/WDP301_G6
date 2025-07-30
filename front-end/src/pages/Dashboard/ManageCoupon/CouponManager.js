import React, { useEffect, useState } from 'react';
import CouponService from '../../services/api/CouponService';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrderValue: '', maxDiscount: '', expiryDate: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const data = await CouponService.getAllCoupons();
    setCoupons(data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await CouponService.updateCoupon(editingId, form);
    } else {
      await CouponService.createCoupon(form);
    }
    setForm({ code: '', type: 'percent', value: '', minOrderValue: '', maxDiscount: '', expiryDate: '' });
    setEditingId(null);
    fetchCoupons();
  };

  const handleEdit = coupon => {
    setForm({ ...coupon, expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : '' });
    setEditingId(coupon._id);
  };

  const handleDelete = async id => {
    await CouponService.deleteCoupon(id);
    fetchCoupons();
  };

  return (
    <div>
      <h2>Quản lý Coupon</h2>
      <form onSubmit={handleSubmit}>
        <input name="code" placeholder="Mã coupon" value={form.code} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="percent">Phần trăm</option>
          <option value="amount">Số tiền</option>
        </select>
        <input name="value" type="number" placeholder="Giá trị" value={form.value} onChange={handleChange} required />
        <input name="minOrderValue" type="number" placeholder="Đơn tối thiểu" value={form.minOrderValue} onChange={handleChange} />
        <input name="maxDiscount" type="number" placeholder="Giảm tối đa" value={form.maxDiscount} onChange={handleChange} />
        <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Mã</th><th>Loại</th><th>Giá trị</th><th>Đơn tối thiểu</th><th>Giảm tối đa</th><th>Ngày hết hạn</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.type}</td>
              <td>{coupon.value}</td>
              <td>{coupon.minOrderValue}</td>
              <td>{coupon.maxDiscount}</td>
              <td>{coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : ''}</td>
              <td>
                <button onClick={() => handleEdit(coupon)}>Sửa</button>
                <button onClick={() => handleDelete(coupon._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponManager;