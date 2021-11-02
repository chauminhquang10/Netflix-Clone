import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
const Footer = () => {
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
      />
      <div class="content1"></div>
      <footer>
        <div class="main-content">
          <div class="left box">
            <h2>Social Media</h2>
            <div class="content">
              <div class="linker">
                <section style={{ marginTop: "12px" }} class="facebook">
                  <Link class="l-link" to="/">
                    Facebook
                  </Link>
                </section>
                <section style={{ marginTop: "12px" }} class="switter">
                  <Link class="l-link" to="/">
                    Twitter
                  </Link>
                </section>
                <section class="instagram">
                  <Link class="l-link" to="/">
                    Instagram
                  </Link>
                </section>
                <section class="youtube">
                  <Link class="l-link" to="/">
                    Youtube
                  </Link>
                </section>
              </div>
              <div class="social">
                <a href="">
                  <span class="fab fa-facebook-f"></span>
                </a>
                <a href="">
                  <span class="fab fa-twitter"></span>
                </a>
                <a href="">
                  <span class="fab fa-instagram"></span>
                </a>
                <a href="">
                  <span class="fab fa-youtube"></span>
                </a>
              </div>
            </div>
          </div>
          <div class="center box">
            <h2>Team</h2>
            <div class="content">
              <div class="place">
                <span class="fas fa-map-marker-alt"></span>
                <span class="text">UIT, Ho Chi Minh city</span>
              </div>
              <div class="phone">
                <span class="fas fa-phone-alt"></span>
                <span class="text">+089-765432100</span>
              </div>
              <div class="email">
                <span class="fas fa-envelope"></span>
                <span class="text">chaumingquang10@gmail.com</span>
              </div>
            </div>
          </div>
          <div class="right box">
            <h2>Contact us</h2>
            <div class="content">
              <form action="#">
                <div class="email">
                  <div class="text">Email *</div>
                  <input type="email" required />
                </div>
                <div class="msg">
                  <div class="text">Message *</div>
                  <textarea rows="2" cols="25" required></textarea>
                </div>
                <div class="btn">
                  <button type="submit">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="bottom">
          <center>
            <span class="credit">
              <a href="">NetflixClone</a> |{" "}
            </span>
            <span class="far fa-copyright"></span>
            <span> 2021 All rights reserved.</span>
          </center>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
