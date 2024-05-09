import "./App.css"
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App() {

  //READ functionality
  const Getcatalog = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [oneProduct, setOneProduct] = useState(null);
    const [id, setId] = useState("");
    const fetchAllProducts = () => {
      fetch("http://localhost:8081/plants")
        .then((response) => response.json())
        .then((data) => {
          console.log("Show Catalog of Products :", data);
          setProducts(data);
        });
    };
    const fetchProductById = () => {
      if (id) {
        fetch(`http://localhost:8081/plants/${id}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Show one product: ", data);
            setOneProduct(data);
          })
          .catch(() => {
            setOneProduct(null);
          });
      } else {
        setOneProduct(null);
      }
    };
    useEffect(() => {
      fetchAllProducts();
      fetchProductById();
    }, [id]);
    return (<div>
      <div className="App">
        <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
        <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
        <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
        <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
        <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
        <button className="button" onClick={() => navigate('/students')}>About</button>
      </div>
      <div className="container">
        <br /><h2>Find Plant</h2><br />
        <input className="input3" type="text" placeholder="Enter ID" onChange={(e) => setId(e.target.value)} /><br />
        <p>Enter a plant ID in the search above</p>
        {oneProduct && (
          <div className="card">
            <img className="square-image" src={oneProduct.image} alt="product" width={30} /><br />
            <div><strong>{oneProduct.title}</strong></div><br />
            <div><strong>Price:</strong> ${oneProduct.price}</div><br />
            <div><strong>Description:</strong> {oneProduct.description}</div><br />
            <div><strong>Rating:</strong> {oneProduct.rating}/5</div>
          </div>
        )}
        <br /><h2>Browse All Plants</h2>
      </div>
      <div className="card-container">
        {products.map((el) => (
          <div key={el.id} className="card">
            <img className="square-image" src={el.image} alt="product" width={30} /><br />
            <div><strong>{el.title}</strong></div><br />
            <div><strong>Price:</strong> ${el.price}</div><br />
            <div><strong>Description:</strong> {el.description}</div><br />
            <div><strong>Rating:</strong> {el.rating}/5</div>
          </div>
        ))}
      </div><br /><br />
    </div>
    );
  };

  //CREATE functionality
  const Postcatalog = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: '',
      title: '',
      price: '',
      description: '',
      image: '',
      rating: ''
    });
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      formData.id = parseInt(formData.id);
      console.log(e.target.value);
      fetch("http://localhost:8081/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(response => {
          if (response.status !== 200) {
            return response.json()
              .then(errData => {
                throw new Error(`POST response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`);
              })
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          alert("product added successfully!");
        })
        .catch(error => {
          console.error('Error adding product:', error);
          alert('Error adding product:' + error.message);
        });
    }
    return (
      <div>
        <div className="App">
          <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
          <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
          <button className="button" onClick={() => navigate('/students')}>About</button>
        </div>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <br /><h2>Create a New Plant Listing</h2><br />
            <div className="App">
              <p>Enter new plant details below</p>
              <input className="input" type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" required /> <br />
              <input className="input" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required /> <br />
              <input className="input" type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required /> <br />
              <input className="input" type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required /> <br />
              <input className="input" type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required /> <br />
              <input className="input" type="text" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" required /> <br /><br />
              <button className="add-product-button" type="submit">Add Lisiting</button><br /><br />
            </div>
          </form>
        </div>
      </div>);
  }

  //UPDATE functionality
  const Putcatalog = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: "",
      price: "",
    });
    const [oneProduct, setOneProduct] = useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    useEffect(() => {
      if (formData.id) {
        fetch(`http://localhost:8081/plants/${formData.id}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Show one product: ", data);
            setOneProduct(data);
          })
          .catch(() => {
            setOneProduct(null);
          });
      } else {
        setOneProduct(null);
      }
    }, [formData.id]);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
      fetch(`http://localhost:8081/plants/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...oneProduct,
          price: formData.price,
        }),
      })
        .then((response) => {
          if (response.status !== 200) {
            return response.json().then((errData) => {
              throw new Error(
                `PUT response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          alert("Item updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating item:", error);
          alert("Error updating item:" + error.message);
        });
    };

    return (
      <div>
        <div className="App">
          <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
          <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
          <button className="button" onClick={() => navigate('/students')}>About</button>
        </div>
        <div className="App">
          <form onSubmit={handleSubmit}><br />
            <h2>Modify an Existing Plant Listing by ID</h2><br />
            <p>Enter a plant ID below to modify its price</p>
            <input className="input3" type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" required /><br /><br />
            <div className="container">
              {oneProduct && (
                <div className="put-card put-card-text">
                  <img className="square-image" src={oneProduct.image} alt="product" /><br /><br />
                  <div>
                    <strong>{oneProduct.title}</strong><br />
                    <strong>Price:</strong> ${oneProduct.price}<br />
                    <strong>Description:</strong> {oneProduct.description}<br />
                    <strong>Rating:</strong> {oneProduct.rating}/5<br />
                  </div>
                </div>
              )}
            </div>
            <input className="input3" type="text" name="price" value={formData.price} onChange={handleChange} placeholder="New Price" required /><br /><br />
            <button className="add-product-button" type="submit">Modify Plant</button><br /><br />
          </form>
        </div>
      </div>
    );
  };


  //DELETE functionality
  const Deletecatalog = () => {
    const [products, setProducts] = useState([]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
      fetch("http://localhost:8081/plants")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          console.log("Load initial Catalog of Products in DELETE :", data);
        });
    }, []);
    function getOneByOneProductNext() {
      if (products.length > 0) {
        if (index === products.length - 1) setIndex(0);
        else setIndex(index + 1);
      }
    }
    function getOneByOneProductPrev() {
      if (products.length > 0) {
        if (index === 0) setIndex(products.length - 1);
        else setIndex(index - 1);
      }
    }
    const deleteOneProduct = (id) => {
      console.log("Product to delete :", id);
      fetch(`http://localhost:8081/plants/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then(response => {
          if (response.status !== 200) {
            return response.json()
              .then(errData => {
                throw new Error(`DELETE response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`);
              })
          }
          return response.json();
        })
        .then(() => {
          console.log("Delete a product completed : ", id);
          const newProducts = products.filter(product => product.id !== id);
          setProducts(newProducts);
          setIndex(0);
          alert("Product deleted successfully!");
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          alert('Error deleting product:' + error.message);
        });
    }
    return (<div>
      <div className="App">
        <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
        <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
        <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
        <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
        <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
        <button className="button" onClick={() => navigate('/students')}>About</button>
      </div>
      <div className="container">
        <br /><h2>Delete a Plant Listing</h2><br />
        <p>Cycle through the catalog below to delete a listing</p>
      </div><br />
      <div className="App">
        <button className="add-product-button lhs" onClick={() => getOneByOneProductPrev()}>&lt;- Prev</button>
        <button className="delete-btn" onClick={() => deleteOneProduct(products[index].id)}>Delete</button>
        <button className="add-product-button rhs" onClick={() => getOneByOneProductNext()}>Next -&gt;</button>
      </div>
      <div className="container">
        {products.length > 0 && (
          <div>
            <div key={products[index].id} className="card">
              <img className="square-image" src={products[index].image} width={30} /> <br />
              <div><strong>{products[index].title}</strong></div>
              <div><strong>Price:</strong> ${products[index].price}</div>
              <div><strong>Description:</strong> {products[index].description}</div>
              <div><strong>Rating:</strong> {products[index].rating}/5</div><br />
              {/* <button className="add-product-button" onClick={() => deleteOneProduct(products[index].id)}>Delete</button> */}
            </div><br />
          </div>
        )}
      </div>
    </div>
    );
  }

  //Shop view
  const ShopView = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [dataF, setDataF] = useState({});
    const [view, setView] = useState("browse");
    const [products, setProducts] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();

    //Fetch data from MongoDB
    useEffect(() => {
      async function fetchProducts() {
        try {
          const response = await fetch("http://localhost:8081/plants");
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
      fetchProducts();
    }, []);

    function howManyofThis(id) {
      let hmot = cart.filter((cartItem) => cartItem.id === id);
      return hmot.length;
    }

    //add items to cart
    const addToCart = (el) => {
      setCart([...cart, el]);
    };

    //remove items from cart
    const removeFromCart = (el) => {
      const indexToRemove = cart.findIndex((cartItem) => cartItem.id === el.id);
      if (indexToRemove !== -1) {
        const updatedCart = [...cart];
        updatedCart.splice(indexToRemove, 1);
        setCart(updatedCart);
      }
    };

    const onSubmit = (data) => {
      setDataF(data);
      setView("confirmation");
    };

    const updateHooks = () => {
      setView("browse");
      setDataF({});
      setCart([]);
    };

    useEffect(() => {
      total();
    }, [cart]);

    //compute total price
    const total = () => {
      let totalVal = 0;
      for (const item of cart) {
        totalVal += parseFloat(item.price);
      }
      totalVal = totalVal.toFixed(2);
      setCartTotal(totalVal);
    };


    //Browse view
    const BrowseView = () => {
      const [searchQuery, setSearchQuery] = useState('');

      // search bar functionality
      const filteredItems = products.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

      const listItems = filteredItems.map((el) => (
        <div className="shop-card" key={el.id}>
          <img className="square-image" src={el.image} alt={el.title} /><br /><br />
          <div><strong>{el.title}</strong></div><br />
          <div>{el.description}</div><br />
          <div><strong>Price:</strong> ${el.price} x {howManyofThis(el.id)}</div><br />
          <button type="button" className="btn btn-secondary" onClick={() => addToCart(el)}> Add to Cart </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => removeFromCart(el)} > Remove from Cart </button>
        </div>
      ));

      return (<div>
        <div className="App">
          <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
          <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
          <button className="button" onClick={() => navigate('/students')}>About</button>
        </div>
        <div className="container"><br />
          <h2>Shop Plants</h2><br />
          <div>
            <input className="input2" type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
            <button className="clr-search-btn" type="button" onClick={() => setSearchQuery('')}>Clear Search</button>
          </div><br />
          <p>Choose plants to add to cart</p>
          <button onClick={() => setView("cart")} className="btn btn-primary">View Cart</button><br /><br />
          <div className="shop-card-container">{listItems}</div><br />
        </div>
      </div>
      );
    };

    //Payment functionality
    const Payment = () => {
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div >
              <input className="form-input" {...register("fullName", { required: true })} placeholder="Full Name" />
              {errors.fullName && <p className="text-danger">Full Name is required.</p>}
            </div>

            <div>
              <input className="form-input" {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i //email validation
              })} placeholder="Email" />
              {errors.email && <p className="text-danger">Email is required and must be valid.</p>}
            </div>

            <div>
              <input className="form-input" {...register("creditCard", {
                required: true,
                minLength: 16, //no. has to be 16 digits
                maxLength: 16,
                pattern: /^\d+$/ //only accept digits for credit card no.
              })} placeholder="Credit Card" />
              {errors.creditCard && <p className="text-danger">Credit Card is required and must be a 16-digit numeric string.</p>}
            </div>

            <div>
              <input className="form-input" {...register("address", { required: true })} placeholder="Address" />
              {errors.address && <p className="text-danger">Address is required.</p>}
            </div>

            <div>
              <input className="form-input" {...register("address2")} placeholder="Address 2" />
            </div>

            <div>
              <input className="form-input" {...register("city", { required: true })} placeholder="City" />
              {errors.city && <p className="text-danger">City is required.</p>}
            </div>

            <div>
              <input className="form-input" {...register("state", { required: true })} placeholder="State" />
              {errors.state && <p className="text-danger">State is required.</p>}
            </div>

            <div>
              <input className="form-input" {...register("zip", {
                required: true,
                pattern: /^\d{5}$/ //zip validation
              })} placeholder="Zip" />
              {errors.zip && <p className="text-danger">Zip is required and must be a 5-digit numeric string.</p>}
            </div>
            <button type="submit" className="btn btn-primary container">Order</button><br /><br />
          </form>
        </div>
      );
    };

    // Cart view
    const CartView = () => {
      const uniqueCartItems = Array.from(new Set(cart.map(el => el.id)))
        .map(id => {
          return {
            ...cart.find(el => el.id === id),
            quantity: cart.filter(el => el.id === id).length
          };
        });
      const cartItems = uniqueCartItems.map((el, index) => (
        <div key={index} className="cart-card cart-item">
          <div className="item-details">
            <img width="100" src={el.image} alt={el.title} />
            <div>
              <div>{el.title}</div>
              <div>{el.category}</div>
            </div>
          </div>
          <div className="item-controls">
            <div>${el.price} x {el.quantity}</div>
            <div className="buttons">
              <button type="button" className="btn btn-outline-secondary" onClick={() => removeFromCart(el)}> - </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => addToCart(el)}> + </button>
            </div>
          </div>
        </div>
      ));

      return (<div>
        <div className="App">
          <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
          <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
          <button className="button" onClick={() => navigate('/students')}>About</button>
        </div>
        <div className="container"><br />
          <h2><b>Shopping Cart</b></h2>
          <p>View your cart items</p>
          <button onClick={() => setView("browse")} className="btn btn-secondary">Return</button><br />
          <p className="card container"><strong>Order total: ${cartTotal}</strong></p>
          <h3>Items:</h3><br />
          <div>{cartItems}</div><br />
          <h2><b>Payment:</b></h2><br />
          <Payment />
        </div>
      </div>
      );
    };

    //Confirmation view
    const SummaryView = () => {
      const uniqueCartItems = Array.from(new Set(cart.map(el => el.id)))
        .map(id => {
          return {
            ...cart.find(el => el.id === id),
            quantity: cart.filter(el => el.id === id).length
          };
        });

      const cartItems = uniqueCartItems.map((el, index) => (
        <div key={index} className="cart-card cart-item">
          <div className="item-details">
            <img width="100" src={el.image} alt={el.title} />
            <div>
              <div>{el.title}</div>
              <div>{el.category}</div>
            </div>
          </div>
          <div className="item-controls">
            <div>${el.price} x {el.quantity}</div>
          </div>
        </div>
      ));

      return (<div>
        <div className="App">
          <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
          <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
          <button className="button" onClick={() => navigate('/students')}>About</button>
        </div>
        <div className="container"><br />
          <h2><b>Order Summary</b></h2>
          <p>View your order information</p>
          <button onClick={() => setView("cart")} className="btn btn-primary">Back to Cart</button><br /><br />
          <h4>Order total: ${cartTotal}</h4><br />
          <div className="card">
            <h3><strong>Buyer info:</strong></h3><br />
            <p><strong>Name:</strong> {dataF.fullName}</p>
            <p><strong>Email:</strong> {dataF.email}</p>
            <p><strong>Card:</strong> {dataF.creditCard}</p>
            <p><strong>Street Address:</strong> {dataF.address}</p>
            <p>{dataF.address2}</p>
            <p><strong>City/State/Zip:</strong> {dataF.city}, {dataF.state} {dataF.zip} </p>
          </div><br />
          <h4>Purchased:</h4><br />
          <div>{cartItems}</div><br />
          <button onClick={updateHooks} className="btn btn-secondary">Back to Browse</button><br /><br />
        </div>
      </div>
      );
    };

    return (
      <div>
        {view === "browse" && <BrowseView />}
        {view === "cart" && <CartView />}
        {view === "confirmation" && <SummaryView />}
      </div>
    );
  }

  //About view
  const Students = () => {
    const navigate = useNavigate();

    return (
      <div>
        <div className="App">
          <button className="button" onClick={() => navigate('/shop')}>Shop for Plants</button>
          <button className="button" onClick={() => navigate('/getcatalog')}>Plant Catalog</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>Create Listing</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>Modify Listing</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>Delete Listing</button>
          <button className="button" onClick={() => navigate('/students')}>About</button>
        </div>
        <div className="container"><br />
          <h2>Student Information</h2><br />
          <p><strong>Team Members:</strong></p>
          <ul>
            <div>Student 1: Bella Singh, bellas23@iastate.edu</div>
            <div>Student 2: Sandeeptha Madan, sandee13@iastate.edu</div>
          </ul>
          <div className="App">
            <p><strong>Course:</strong> SE/ComS319 Construction of User Interfaces, Spring 2024</p>
            <p><strong>Date:</strong> 5/1/2024</p>
            <p><strong>Professor Name:</strong> Ali Janessari</p>
            <p><strong>Project Introduction:</strong></p>
            <p>The primary goal of this project was to develop a MERN (MongoDB, Express, React, Node.js)
              application for efficiently managing a catalog of plants. The creation of this website
              involves implementing CRUD (Create, Read, Update, Delete) functionalities within
              a user-friendly interface stylized with CSS, DOM, and JSX. Utilizing React for the
              frontend and Node.js with Express for the backend, this project uses a MongoDB database
              for backend storage of a catalog of plants.</p><br /><br />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/getcatalog" element={<Getcatalog />} />
        <Route path="/postcatalog" element={<Postcatalog />} />
        <Route path="/putcatalog" element={<Putcatalog />} />
        <Route path="/deletecatalog" element={<Deletecatalog />} />
        <Route path="/shop" element={<ShopView />} />
        <Route path="/students" element={<Students />} />
        <Route path="/" element={<Getcatalog />} /> {/* Default view */}
      </Routes>
    </Router>
  );
}

export default App;