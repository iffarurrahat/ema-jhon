import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  //product to be rendered on the UI
  const [displayProduct, setDisplayProduct] = useState([]);

  useEffect(() => {
    // console.log('product Api called');
    fetch('./products.JSON')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        // console.log('Products recieved');
        setDisplayProduct(data);
      });
  }, []);

  useEffect(() => {
    // console.log('Localstroage cart call');
    if (products.length) {
      const saveCart = getStoredCart();
      const storedCart = [];
      for (const key in saveCart) {
        // console.log(key, saveCart[key]);
        const addedProduct = products.find(product => product.key === key);
        if (addedProduct) {
          const quantity = saveCart[key];
          addedProduct.quantity = quantity;
          // console.log(addedProduct);
          storedCart.push(addedProduct);
        }
      }
      setCart(storedCart);
    }
  }, [products]);

  const handleAddToCart = product => {
    const newCart = [...cart, product];
    setCart(newCart);
    //save local stroage (for now)
    addToDb(product.key);
  };
  const handleSearch = event => {
    const searchText = event.target.value;
    const matchedProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setDisplayProduct(matchedProducts);
    // console.log(matchedProducts.length);
  };
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search Product"
        />
      </div>
      <div className="shop-container">
        <div className="product-conatiner">
          {displayProduct.map(product => (
            <Product
              key={product.key}
              product={product}
              handleAddToCart={handleAddToCart}
            ></Product>
          ))}
        </div>
        <div className="cart-container">
          <Cart cart={cart}></Cart>
        </div>
      </div>
    </>
  );
};

export default Shop;
