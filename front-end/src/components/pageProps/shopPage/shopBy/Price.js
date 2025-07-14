import React, { useState } from "react";
import { useDispatch } from "react-redux";
import NavTitle from "./NavTitle";
import { togglePrice } from "../../../../redux/orebiSlice";

const priceList = [
  { _id: 950, priceOne: 0.0, priceTwo: 49.99 },
  { _id: 951, priceOne: 50.0, priceTwo: 99.99 },
  { _id: 952, priceOne: 100.0, priceTwo: 199.99 },
  { _id: 953, priceOne: 200.0, priceTwo: 399.99 },
  { _id: 954, priceOne: 400.0, priceTwo: 599.99 },
  { _id: 955, priceOne: 600.0, priceTwo: 999.0 },
  { _id: 956, priceOne: 1000.0, priceTwo: 2999.0 },
];

const Price = () => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectPrice = (item) => {
    setSelectedId(item._id);
    dispatch(togglePrice(item));
  };

  return (
    <div className="cursor-pointer">
      <NavTitle title="Xếp theo giá" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-base text-[#444]">
          {priceList.map((item) => (
            <li
              key={item._id}
              className={`border rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer
                ${selectedId === item._id
                  ? "bg-green-100 border-green-500 text-green-700 font-bold shadow"
                  : "border-gray-200 hover:bg-green-50 hover:border-green-400"}
              `}
              onClick={() => handleSelectPrice(item)}
            >
              <input
                type="radio"
                name="price"
                id={item._id}
                checked={selectedId === item._id}
                onChange={() => handleSelectPrice(item)}
                className="accent-green-600 w-5 h-5"
              />
              <label htmlFor={item._id} className="text-lg select-none w-full cursor-pointer">
                {item.priceOne.toFixed(2)} VND - {item.priceTwo.toFixed(2)} VND
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;