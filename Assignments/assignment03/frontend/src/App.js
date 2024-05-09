// Author: Bella Singh
// ISU Netid : bellas23@iastate.edu
// Date :  April 26, 2024

import "./App.css"
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App() {

  //GET all products/product by id
  const Getcatalog = () => {
    const [products, setProducts] = useState([]);
    const [oneProduct, setOneProduct] = useState(null);
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const fetchAllProducts = () => {
      fetch("http://localhost:8082/catalog")
        .then((response) => response.json())
        .then((data) => {
          console.log("Show Catalog of Products :", data);
          setProducts(data);
        });
    };
    const fetchProductById = () => {
      if (id) {
        fetch(`http://localhost:8082/catalog/${id}`)
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
        <button className="button" onClick={() => navigate('/getcatalog')}>GET All Products</button>
        <button className="button" onClick={() => navigate('/postcatalog')}>POST New Product</button>
        <button className="button" onClick={() => navigate('/putcatalog')}>PUT (modify) Product</button>
        <button className="button" onClick={() => navigate('/deletecatalog')}>DELETE Product</button>
        <button className="button" onClick={() => navigate('/students')}>Student Info</button>
      </div>
      <div className="container">
        <br /><h2>Find One Product</h2><br />
        <input className="input3" type="text" placeholder="Enter ID" onChange={(e) => setId(e.target.value)} /><br />
        <p>Enter a product ID in the search above</p>
        {oneProduct && (
          <div className="card">
            <img className="card-image" src={oneProduct.image} alt="product" width={30} /><br />
            <div><strong>Title: {oneProduct.title}</strong></div><br />
            <div><strong>Category:</strong> {oneProduct.category}</div><br />
            <div><strong>Price:</strong> ${oneProduct.price}</div><br />
            <div><strong>Description:</strong> {oneProduct.description}</div><br />
            <div><strong>Rating:</strong> {oneProduct.rating}/5</div><br />
          </div>
        )}
        <br /><h2>All Products</h2>
      </div>
      <div className="card-container">
        {products.map((el) => (
          <div key={el.id} className="card">
            <img className="card-image" src={el.image} alt="product" width={30} /><br />
            <div><strong>Title: {el.title}</strong></div><br />
            <div><strong>Category:</strong> {el.category}</div><br />
            <div><strong>Price:</strong> ${el.price}</div><br />
            <div><strong>Description:</strong> {el.description}</div><br />
            <div><strong>Rating:</strong> {el.rating}/5</div><br />
          </div>
        ))}
      </div>
    </div>
    );
  };

  // POST a new item
  const Postcatalog = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: '',
      title: '',
      price: '',
      description: '',
      category: '',
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
      fetch("http://localhost:8082/catalog", {
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
          alert('Error adding product:' + error.message); // Display alert if there's an error
        });
    }
    return (
      <div>
        <div className="App">
          <button className="button" onClick={() => navigate('/getcatalog')}>GET All Products</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>POST New Product</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>PUT (modify) Product</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>DELETE Product</button>
          <button className="button" onClick={() => navigate('/students')}>Student Info</button>
        </div>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <br /><h2>Post a New Product</h2><br />
            <div className="App">
              <p>Enter product details below</p>
              <input className="input" type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" required /> <br />
              <input className="input" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required /> <br />
              <input className="input" type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required /> <br />
              <input className="input" type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required /> <br />
              <input className="input" type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required /> <br />
              <input className="input" type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required /> <br />
              <input className="input" type="text" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" required /> <br /><br />
              <button className="add-product-button" type="submit">Add Product</button><br /><br />
            </div>
          </form>
        </div>
      </div>);
  }

  // PUT - Modify an item
  const Putcatalog = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: "",
      price: "",
    });
    const [oneProduct, setOneProduct] = useState(null); // Added state to store the product details

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    useEffect(() => {
      if (formData.id) {
        fetch(`http://localhost:8082/catalog/${formData.id}`)
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
      fetch(`http://localhost:8082/catalog/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...oneProduct, // Keep the rest of the product details unchanged
          price: formData.price, // Update only the price
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
          alert("Error updating item:" + error.message); // Display alert if there's an error
        });
    };

    return (
      <div>
        <div className="App">
          <button className="button" onClick={() => navigate("/getcatalog")}>GET All Products</button>
          <button className="button" onClick={() => navigate("/postcatalog")}>POST New Product</button>
          <button className="button" onClick={() => navigate("/putcatalog")}>PUT (modify) Product</button>
          <button className="button" onClick={() => navigate("/deletecatalog")}>DELETE Product</button>
          <button className="button" onClick={() => navigate("/students")}>Student Info</button>
        </div>
        <div className="App">
          <form onSubmit={handleSubmit}><br />
            <h2>Put (Modify) an Existing Product by ID</h2><br />
            <p>Enter a product ID below to change its price</p>
            <input className="input3" type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" required /><br /><br />
            <div className="container">
              {oneProduct && (
                <div className="put-card put-card-text">
                  <img className="card-image" src={oneProduct.image} alt="product" /><br /><br />
                  <div>
                    <strong>Title: {oneProduct.title}</strong><br />
                    <strong>Category:</strong> {oneProduct.category}<br />
                    <strong>Price:</strong> ${oneProduct.price}<br />
                    <strong>Description:</strong> {oneProduct.description}<br />
                    <strong>Rating:</strong> {oneProduct.rating}/5<br />
                  </div>
                </div>
              )}
            </div>
            <input className="input3" type="text" name="price" value={formData.price} onChange={handleChange} placeholder="New Price" required /><br /><br />
            <button className="add-product-button" type="submit">Modify Product</button><br /><br />
          </form>
        </div>
      </div>
    );
  };


  // DELETE - Delete an item
  const Deletecatalog = () => {
    const [products, setProducts] = useState([]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
      fetch("http://localhost:8082/catalog")
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
      fetch(`http://localhost:8082/catalog/${id}`, {
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
          alert('Error deleting product:' + error.message); // Display alert if there's an error
        });
    }
    return (<div>
      <div className="App">
        <button className="button" onClick={() => navigate('/getcatalog')}>GET All Products</button>
        <button className="button" onClick={() => navigate('/postcatalog')}>POST New Product</button>
        <button className="button" onClick={() => navigate('/putcatalog')}>PUT (modify) Product</button>
        <button className="button" onClick={() => navigate('/deletecatalog')}>DELETE Product</button>
        <button className="button" onClick={() => navigate('/students')}>Student Info</button>
      </div>
      <div className="container">
        <br /><h2>Delete one product:</h2>
      </div><br />
      <div className="App">
        <button className="add-product-button" onClick={() => getOneByOneProductPrev()}>Prev</button>
        <button className="add-product-button" onClick={() => getOneByOneProductNext()}>Next</button>
        <button className="add-product-button" onClick={() => deleteOneProduct(products[index].id)}>Delete</button>
      </div><br />
      <div className="container">
        {products.length > 0 && (
          <div>
            <div key={products[index].id} className="card">
              <img className="card-image" src={products[index].image} width={30} /> <br />
              <div><h3><strong>ID: {products[index].id}</strong></h3></div>
              <div><strong>Title: {products[index].title}</strong></div><br />
              <div><strong>Category:</strong> {products[index].category}</div><br />
              <div><strong>Price:</strong> ${products[index].price}</div><br />
              <div><strong>Description:</strong> {products[index].description}</div><br />
              <div><strong>Rating:</strong> {products[index].rating}/5</div><br />
            </div><br />
          </div>
        )}
      </div>
    </div>
    );
  }

  //Student view
  const Students = () => {
    const navigate = useNavigate();

    return (
      <div>
        <div className="App">
          <button className="button" onClick={() => navigate('/getcatalog')}>GET All Products</button>
          <button className="button" onClick={() => navigate('/postcatalog')}>POST New Product</button>
          <button className="button" onClick={() => navigate('/putcatalog')}>PUT (modify) Product</button>
          <button className="button" onClick={() => navigate('/deletecatalog')}>DELETE Product</button>
          <button className="button" onClick={() => navigate('/students')}>Student Info</button>
        </div>
        <div className="container"><br />
          <h2>Student Information</h2><br />
          <p><strong>Team Members:</strong></p>
          <ul>
            <div>Student 1: Bella Singh, bellas23@iastate.edu</div>
            <div>Student 2: Sandeeptha Madan, sandee13@iastate.edu</div>
          </ul>
          <div className="App">
            <p><strong>Course:</strong> SE/COMS 319</p>
            <p><strong>Date:</strong> 4/29/2024</p>
            <p><strong>Professor Name:</strong> Ali Janessari</p>
            <p><strong>Project Introduction:</strong></p>
            <p>The primary goal of this project was to develop a MERN (MongoDB, Express, React, Node.js)
              application for efficiently managing a catalog of products sourced from the
              "https://fakestoreapi.com/products" dataset. The creation of this website
              involves implementing CRUD (Create, Read, Update, Delete) functionalities within
              a user-friendly interface stylized with CSS, DOM, and JSX. Utilizing React for the
              frontend and Node.js with Express for the backend, this project uses a MongoDB database
              for backend storage of a catalog of products.</p><br /><br />
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
        <Route path="/students" element={<Students />} />
        <Route path="/" element={<Getcatalog />} /> {/* Default view */}
      </Routes>
    </Router>
  );
}

export default App;