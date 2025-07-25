import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import {
  deleteItemWL
} from "../../redux/orebiSlice";
import ProductService from "../../services/api/ProductService";
import ImgDefault from '../../assets/images/default.jpg';
const ItemWishlist = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={() => dispatch(deleteItemWL({ _id: item._id, color: item.color }))}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <img className="w-32 h-32" src={item?.images && item.images.length > 0 ? ProductService.getImage(item.images[0].filename) : 
          ImgDefault
          } alt="productImage" />
        <h1 className="font-titleFont font-semibold">{item.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span>Size:</span>
          <span className="text-sm text-gray-500">{item.color}</span>
        </div>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="w-1/3 flex items-center gap-6 text-lg">
        </div>
        <div className="flex w-1/3 items-center text-lg font-semibold">
          ${item.price}
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          {/* <p>${item.quantity * item.price}</p> */}
        </div>
      </div>
    </div>
  );
};

export default ItemWishlist;
