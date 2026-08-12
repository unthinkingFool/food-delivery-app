import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { serverUrl } from "../App";
import { updateItem } from "../redux/ownerSlice";

function EditItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { itemId } = useParams();

  const { items } = useSelector((state) => state.owner);

  const item = items.find(
    (item) => item.id === Number(itemId)
  );

  const [name, setname] = useState("");
  const [category, setcategory] = useState("");
  const [food_type, setfood_type] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");
  const [discount_price, setdiscount_price] = useState("");

  const [frontendimage, setfrontendimage] = useState(null);
  const [backendimage, setbackendimage] = useState(null);

  const categories = ["burger", "pizza", "drink", "fries"];
  const types = ["veg", "non-veg"];

  // Load existing item data
  useEffect(() => {
    if (item) {
      setname(item.name || "");
      setcategory(item.category || "");
      setfood_type(item.food_type || "");
      setdescription(item.description || "");
      setprice(item.price || "");
      setdiscount_price(item.discount_price || "");

      if (item.image_link) {
        setfrontendimage(item.image_link);
      }
    }
  }, [item]);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setbackendimage(file);
    setfrontendimage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("food_type", food_type);
      formData.append("price", price);

      formData.append(
        "discount_price",
        discount_price === "" ? "" : discount_price
      );

      if (backendimage) {
        formData.append("image", backendimage);
      }

      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(updateItem(result.data.item));

      console.log(result.data);

      navigate("/");
    } catch (error) {
      console.log(
        "error while editing item from frontend : ",
        error
      );
    }
  };

  if (!item) {
    return (
      <div>
        <h1>Item not found</h1>

        <button onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back */}

      <div
        onClick={() => {
          navigate("/");
        }}
      >
        Back
      </div>

      <div>
        {/* Title */}

        <div>Edit Food</div>

        {/* Form */}

        <form onSubmit={handleSubmit}>
          {/* Name */}

          <div>
            <label htmlFor="name">
              Name Of Your Item:
            </label>

            <input
              id="name"
              type="text"
              onChange={(e) =>
                setname(e.target.value)
              }
              value={name}
            />
          </div>

          {/* Description */}

          <div>
            <label htmlFor="description">
              Description Of Your Item:
            </label>

            <input
              id="description"
              type="text"
              onChange={(e) =>
                setdescription(e.target.value)
              }
              value={description}
            />
          </div>

          {/* Category */}

          <div>
            <label htmlFor="category">
              Category Of Your Item:
            </label>

            <select
              id="category"
              onChange={(e) =>
                setcategory(e.target.value)
              }
              value={category}
            >
              <option value="">
                select
              </option>

              {categories.map((cate, index) => (
                <option
                  value={cate}
                  key={index}
                >
                  {cate}
                </option>
              ))}
            </select>
          </div>

          {/* Food type */}

          <div>
            <label htmlFor="food_type">
              Type Of Your Item:
            </label>

            <select
              id="food_type"
              onChange={(e) =>
                setfood_type(e.target.value)
              }
              value={food_type}
            >
              <option value="">
                select
              </option>

              {types.map((type, index) => (
                <option
                  value={type}
                  key={index}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}

          <div>
            <label htmlFor="price">
              Price Of Your Item:
            </label>

            <input
              id="price"
              type="number"
              onChange={(e) =>
                setprice(e.target.value)
              }
              value={price}
            />
          </div>

          {/* Discount */}

          <div>
            <label htmlFor="discount_price">
              Give Some Discount On Your Item?
            </label>

            <input
              id="discount_price"
              type="number"
              onChange={(e) =>
                setdiscount_price(e.target.value)
              }
              value={discount_price}
            />
          </div>

          {/* Image */}

          <div>
            <label htmlFor="image">
              Food Image:
            </label>

            <input
              id="image"
              type="file"
              onChange={handleImage}
            />

            {frontendimage && (
              <div>
                <img
                  src={frontendimage}
                  alt="Food"
                />
              </div>
            )}
          </div>

          <button type="submit">
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;