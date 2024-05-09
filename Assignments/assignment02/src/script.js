// Author: Bella Singh 
// netID: bellas23@iastate.edu 
// Date: 4/4/24

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import items from "./products.json";
import "./index.css"; // Import the CSS file

const App = () => {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [dataF, setDataF] = useState({});
    const [view, setView] = useState("browse"); // Initial view is browse

    const { register, handleSubmit, formState: { errors } } = useForm();

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
        let hardCopy = [...cart];
        hardCopy = hardCopy.filter((cartItem) => cartItem.id !== el.id);
        setCart(hardCopy);
        let itemFound = false;
        const updatedCart = cart.filter((cartItem) => {
            if (cartItem.id === el.id && !itemFound) {
                itemFound = true;
                return false;
            }
            return true;
        });
        if (itemFound) {
            setCart(updatedCart);
        }
    };

    const onSubmit = (data) => {
        setDataF(data); // Update dataF with buyer information
        setView("confirmation");
    };

    const updateHooks = () => {
        setView("browse");
        setDataF({});
        setCart([]); // Clear cart state
    };

    useEffect(() => {
        total();
    }, [cart]);

    //computes total price
    const total = () => {
        let totalVal = 0;
        for (const item of cart) {
            totalVal += item.price;
        }
        setCartTotal(totalVal);
    };

    /*
    Browse view
        - Includes search bar to filter products
        - Can add and remove cart items
    */
    const BrowseView = () => {
        const [searchQuery, setSearchQuery] = useState('');

        //search bar functionality
        const filteredItems = items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const handleSearchChange = (e) => {
            setSearchQuery(e.target.value);
        };

        const listItems = filteredItems.map((el) => (
            <div className="product-card" key={el.id}>
                <div className="row main align-items-center">
                    <div className="col-1">
                        <img className="img-fluid" src={el.image} alt={el.title} />
                    </div>
                    <div className="col">
                        <div className="title">{el.title}</div>
                        <div className="category">{el.category}</div>
                    </div>
                    <div className="col">
                        <button type="button" variant="light" onClick={() => removeFromCart(el)} > - </button>{" "}
                        <button type="button" variant="light" onClick={() => addToCart(el)}> + </button>
                    </div>
                    <div className="col">
                        <span className="price">${el.price}</span> <span className="close">&#10005;</span> {howManyofThis(el.id)}
                    </div>
                </div>
            </div>
        ));

        return (
            <div>
                <br />
                <h1><b>Browse Products</b></h1><br />
                <div className="input-group mb-3 product-card"><br />
                    <input type="text" className="form-control" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchQuery('')}>Clear Search</button>
                </div>
                <p>Choose products to add to cart</p>
                <button onClick={() => setView("cart")} className="btn btn-primary">View Cart</button><br /><br />
                <div>{listItems}</div><br />
            </div>
        );
    };

    //function for updating and displaying buyer info in SummaryView
    const Payment = () => {
        return (
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="container mt-5">
                    {/* Payment Form */}
                    <div className="form-group">
                        <input {...register("fullName", { required: true })} placeholder="Full Name" className="form-control" />
                        {errors.fullName && <p className="text-danger">Full Name is required.</p>}
                    </div><br />

                    <div className="form-group">
                        <input {...register("email", {
                            required: true,
                            pattern: /^\S+@\S+$/i //email validation
                        })} placeholder="Email" className="form-control" />
                        {errors.email && <p className="text-danger">Email is required and must be valid.</p>}
                    </div><br />

                    <div className="form-group">
                        <input {...register("creditCard", {
                            required: true,
                            minLength: 16, //no. has to be 16 digits
                            maxLength: 16,
                            pattern: /^\d+$/ //only accept digits for credit card no.
                        })} placeholder="Credit Card" className="form-control" />
                        {errors.creditCard && <p className="text-danger">Credit Card is required and must be a 16-digit numeric string.</p>}
                    </div><br />

                    <div className="form-group">
                        <input {...register("address", { required: true })} placeholder="Address" className="form-control" />
                        {errors.address && <p className="text-danger">Address is required.</p>}
                    </div><br />

                    <div className="form-group">
                        <input {...register("address2")} placeholder="Address 2" className="form-control" />
                    </div><br />

                    <div className="form-group">
                        <input {...register("city", { required: true })} placeholder="City" className="form-control" />
                        {errors.city && <p className="text-danger">City is required.</p>}
                    </div><br />

                    <div className="form-group">
                        <input {...register("state", { required: true })} placeholder="State" className="form-control" />
                        {errors.state && <p className="text-danger">State is required.</p>}
                    </div><br />

                    <div className="form-group">
                        <input {...register("zip", {
                            required: true,
                            pattern: /^\d{5}$/ //zip validation
                        })} placeholder="Zip" className="form-control" />
                        {errors.zip && <p className="text-danger">Zip is required and must be a 5-digit numeric string.</p>}
                    </div><br />

                    <button type="submit" className="btn btn-primary">Order</button>
                </form>
            </div>
        );
    };

    /*
    Cart view
         - Displays list, quantity and value of selected items
         - Displays total value
         - Has checkout form to accept buyer info 
    */
    const CartView = () => {
        const uniqueCartItems = Array.from(new Set(cart.map(el => el.id)))
            .map(id => {
                return {
                    ...cart.find(el => el.id === id),
                    quantity: cart.filter(el => el.id === id).length
                };
            });

        const cartItems = uniqueCartItems.map((el, index) => (
            <div key={index}>
                <div className="row border-top border-bottom" key={el.id}>
                    <div className="row main align-items-center">
                        <div className="col-1">
                            <img className="img-fluid" src={el.image} alt={el.title} />
                        </div>
                        <div className="col">
                            <div className="row text-muted">{el.title}</div>
                            <div className="row">{el.category}</div>
                        </div>
                        <div class="col">
                            <button type="button" variant="light" onClick={() => removeFromCart(el)} > - </button>{" "}
                            <button type="button" variant="light" onClick={() => addToCart(el)}> + </button>
                        </div>
                        <div className="col-1">
                            ${el.price} <span className="close">&#10005;</span> {el.quantity}
                        </div>
                    </div>
                </div>
            </div>
        ));

        //displays items selected in browse, total price, and payment form
        return (
            <div>
                <br />
                <h1><b>Shopping Cart</b></h1>
                <p>View your cart items</p>
                <button onClick={() => setView("browse")} className="btn btn-secondary">Return</button><br /><br />
                <p><strong>Order total: ${cartTotal}</strong></p>
                <div>{cartItems}</div>
                <br />
                <h1><b>Payment:</b></h1>
                <Payment />
            </div>
        );
    };

    /*
    Confirmation view:
        - Displays purchased items and total price
        - Displays User information
        - Includes "Back to Browse" button that navigates back to fresh browse view
    */
    const SummaryView = () => {
        const uniqueCartItems = Array.from(new Set(cart.map(el => el.id)))
            .map(id => {
                return {
                    ...cart.find(el => el.id === id),
                    quantity: cart.filter(el => el.id === id).length
                };
            });

        const cartItems = uniqueCartItems.map((el, index) => (
            <div key={index}>
                <div className="row border-top border-bottom" key={el.id}>
                    <div className="row main align-items-center">
                        <div className="col-1">
                            <img className="img-fluid" src={el.image} alt={el.title} />
                        </div>
                        <div className="col-1">
                            <div className="row text-muted">{el.title}</div>
                            <div className="row">{el.category}</div>
                        </div>
                        <div className="col-1">
                            ${el.price} <span className="close">&#10005;</span> {el.quantity}
                        </div>
                    </div>
                </div>
            </div>
        ));

        //displays total price, buyer info, and items purchased
        return (
            <div>
                <br />
                <h1><b>Order summary</b></h1>
                <p>View your order information</p>

                <button onClick={() => setView("cart")} className="btn btn-primary">Back to Cart</button><br /><br />

                <div className="product-card title">
                    <h4>Order total: ${cartTotal}</h4>
                </div>
                <h4>Buyer info:</h4>
                <div className="product-card">
                    <p>{dataF.fullName}</p>
                    <p>{dataF.email}</p>
                    <p>{dataF.creditCard}</p>
                    <p>{dataF.address}</p>
                    <p>{dataF.address2}</p>
                    <p>{dataF.city}, {dataF.state} {dataF.zip} </p>
                </div>

                <h4>Purchased:</h4>
                <div>{cartItems}</div><br />

                <button onClick={updateHooks} className="btn btn-secondary">Back to Browse</button><br /><br />
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
};

export default App;

/*
Make sure to run the following before "npm start":
    - npm install react-hook-form
    - npm install bootstrap
*/