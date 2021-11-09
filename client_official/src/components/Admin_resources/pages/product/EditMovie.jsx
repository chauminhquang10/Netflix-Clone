import React from "react";
import "./EditMovie.css";
import { Link } from "react-router-dom";
import Chart from "../../Admin_components/chart/Chart";
import { productData } from "../../Admin_components/dummyData";
import { Publish } from "@material-ui/icons";

const EditMovie = () => {
  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newProduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart
            data={productData}
            dataKey="Sales"
            title="Sales Performance"
          ></Chart>
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img
              className="productInfoImg"
              src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1633587460/avatar/b39244lnkpdl8jtgwca3.jpg"
            ></img>
            <span className="productInfoName">Beautiful Girl</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">4123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">active:</span>
              <span className="productInfoValue">yes</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">no</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input type="text" placeholder="Beutiful Girl"></input>
            <label>In Stock</label>
            <select name="inStock" id="idStock">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <label>Active</label>
            <select name="active" id="active">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img
                className="productUploadImg"
                src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1633587460/avatar/b39244lnkpdl8jtgwca3.jpg"
                alt="product-img"
              ></img>
              <label htmlFor="file">
                <Publish></Publish>
              </label>
              <input type="file" id="file" style={{ display: "none" }}></input>
            </div>
            <button className="productButton">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
