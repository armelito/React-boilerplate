import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Not found (404) component
 */
const Product = () => (
  <div className="product-not-found">
    <h1>404</h1>
    <h2>Product not found</h2>
    <p>
      <Link to="/">Return to homepage</Link>
    </p>
  </div>
);

export default Product
