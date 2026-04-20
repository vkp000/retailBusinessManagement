import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";
import { addItem } from "../../Service/ItemService";
import { assets } from "../../assets/Asset";

const ItemForm = () => {
  const { categories, setItemsData, itemsData, setCategories } = useContext(AppContext);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  // FIX: async added, await added on addItem, error variable name fixed
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("item", JSON.stringify(data));
    formData.append("file", image);

    try {
      // FIX: await added (was missing — response.status was always undefined)
      const response = await addItem(formData);

      if (response.status === 201) {
        setItemsData([...itemsData, response.data]);

        // FIX: setCategories (was setcategories — wrong case)
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.categoryId === data.categoryId
              ? { ...category, items: category.items + 1 }
              : category
          )
        );

        toast.success("Item added");
        setData({ name: "", description: "", price: "", categoryId: "" });
        setImage(false);
      } else {
        toast.error("Unable to add item");
      }
    } catch (err) {
      // FIX: was catching 'er' but using 'error' (undefined variable)
      console.error(err);
      toast.error("Unable to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="item-form-container" style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
      <div className="mx-2 mt-2">
        <div className="row">
          <div className="card col-md-8 form-container">
            <div className="card-body">
              <form onSubmit={onSubmitHandler}>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    <img
                      src={image ? URL.createObjectURL(image) : assets.upload}
                      alt="Upload"
                      width={48}
                      style={{ cursor: "pointer" }}
                    />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="form-control"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    placeholder="Item Name"
                    onChange={onChangeHandler}
                    value={data.name}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    name="categoryId"
                    id="category"
                    className="form-control"
                    onChange={onChangeHandler}
                    value={data.categoryId}
                    required
                  >
                    <option value="">-- SELECT CATEGORY --</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="form-control"
                    placeholder="₹200.00"
                    onChange={onChangeHandler}
                    value={data.price}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    rows="5"
                    name="description"
                    id="description"
                    className="form-control"
                    placeholder="Write description of the item"
                    onChange={onChangeHandler}
                    value={data.description}
                  />
                </div>

                <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                  {loading ? "Uploading..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;