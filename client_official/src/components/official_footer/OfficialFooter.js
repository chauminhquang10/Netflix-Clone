import React from "react";
import "./OfficialFooter.css";
import { Link } from "react-router-dom";

const OfficialFooter = () => {
  return (
    <>
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-row">
            <div className="col-4 ">
              <div className="footer-content">
                <h2>Netflix Clone</h2>
                <p style={{ marginTop: "20px" }}>
                  Meet the Ipsums is a handy resource to have around whenever
                  you need some filler text. Here are other useful resources in
                  our archives to check out.
                </p>
                <div className="footer-social-list">
                  <i
                    className="bx bxl-facebook"
                    style={{ fontSize: "35px" }}
                  ></i>
                  <i
                    className="bx bxl-twitter"
                    style={{ fontSize: "35px", marginLeft: "20px" }}
                  ></i>
                  <i
                    className="bx bxl-instagram"
                    style={{ fontSize: "35px", marginLeft: "20px" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-8 ">
              <div className="footer-row">
                <div className="col-3">
                  <div className="footer-content">
                    <p>
                      <b>Flix</b>
                    </p>
                    <ul className="footer-menu">
                      <li>
                        <Link to="!#">About us</Link>
                      </li>
                      <li>
                        <Link to="!#">Pricing plans</Link>
                      </li>
                      <li>
                        <Link to="!#">Policy</Link>
                      </li>
                      <li>
                        <Link to="!#">Contacts</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-3">
                  <div className="footer-content">
                    <p>
                      <b>Browse</b>
                    </p>
                    <ul className="footer-menu">
                      <li>
                        <Link to="!#">Agency</Link>
                      </li>
                      <li>
                        <Link to="!#">Influencer</Link>
                      </li>
                      <li>
                        <Link to="!#">Videos</Link>
                      </li>
                      <li>
                        <Link to="!#">Security</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-3">
                  <div className="footer-content">
                    <p>
                      <b>Help</b>
                    </p>
                    <ul className="footer-menu">
                      <li>
                        <Link to="!#">How it works</Link>
                      </li>
                      <li>
                        <Link to="!#">Testimonials</Link>
                      </li>
                      <li>
                        <Link to="!#">Careers</Link>
                      </li>
                      <li>
                        <Link to="!#">Support</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-3">
                  <div className="footer-content">
                    <p>
                      <b>Download app</b>
                    </p>
                    <ul className="footer-menu">
                      <li>
                        <Link to="!#">
                          <img
                            src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1636708199/google-play_yjgo8l.png"
                            alt=""
                          ></img>
                        </Link>
                      </li>
                      <li>
                        <Link to="!#">
                          <img
                            src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1636708199/app-store_tje68w.png"
                            alt=""
                          ></img>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright">Netflix Clone &copy; 2021 </div>
    </>
  );
};

export default OfficialFooter;
