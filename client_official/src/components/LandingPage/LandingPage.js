import React, { useState } from "react";
import "./LandingPage.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CardImg1 from "../../images/tv.png";
import CardImg2 from "../../images/mobile-image.jpg";
import CardImg3 from "../../images/boxshot.png";
import CardImg4 from "../../images/kids.png";
import CardVideo1 from "../../videos/netflix_ui.m4v";
import CardVideo2 from "../../videos/vid1.m4v";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TabletAndroidIcon from "@mui/icons-material/TabletAndroid";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StyleIcon from "@mui/icons-material/Style";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const LandingPage = () => {
  // xử lí show answer
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);
  const [showAnswer4, setShowAnswer4] = useState(false);

  //xử lí tabs
  const [toggleTabs, setToggleTabs] = useState(1);

  const handleTabsToggle = (tabIndex) => {
    setToggleTabs(tabIndex);
  };

  return (
    <>
      {/* <section className="landing-header-container">
        <header className="landing-header">
          <div className="brand-container">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
              alt="logo"
              className="landing-header-logo"
            ></img>
          </div>
          <Link to="/login" className="landing-sign-in-btn">
            Sign In
          </Link>
        </header>
      </section> */}
      <div style={{ top: "-70px", position: "relative" }}>
        <section className="landing-banner">
          <img
            src="https://www.lifesavvy.com/p/uploads/2020/01/deb2e2c6.jpg?width=1200"
            alt=""
            className="our-story-card-background"
          ></img>

          <div className="our-story-card-text">
            <div className="heading-text">
              <h2>Unlimited movies, TV shows, and more.</h2>
              <h5>Watch anywhere. Cancel anytime.</h5>
              <p>
                Ready to watch? Enter your email to create or restart your
                membership.
              </p>
              <form className="global-search">
                <input type="text" placeholder="Email address"></input>

                <button type="button">
                  Get Started{" "}
                  <ArrowForwardIosIcon className="get-started-icon" />
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="landing-page-cards">
          <div className="landing-page-card-text">
            <h1 className="landing-page-card-title">Enjoy on your TV</h1>
            <h2 className="landing-page-card-subtitle">
              Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV,
              Blu-ray players, and more.
            </h2>
          </div>

          <div className="story-card-img-container">
            <div className="story-card-animation-container">
              <img
                src={CardImg1}
                alt=""
                className="story-card-img"
                style={{ zIndex: "100" }}
              ></img>
              <div className="story-card-animation">
                <video
                  className="story-card-video"
                  playsInline
                  muted
                  loop
                  autoPlay
                >
                  <source src={CardVideo1} type="video/mp4"></source>
                </video>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-page-cards download-watch">
          <div className="story-card-img-container">
            <div className="story-card-animation-container">
              <img src={CardImg2} alt="" className="story-card-img"></img>
              <div className="story-card-animation">
                <div className="story-card-animation-image">
                  <img src={CardImg3} alt=""></img>
                </div>
                <div className="story-card-animation-text">
                  <div className="text-0">Stranger Things</div>
                  <div className="text-1">Downloading</div>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-page-card-text">
            <h1 className="landing-page-card-title">
              Download your shows to watch offline.
            </h1>
            <h2 className="landing-page-card-subtitle">
              Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV,
              Blu-ray players, and more.
            </h2>
          </div>
        </section>

        <section className="landing-page-cards">
          <div className="landing-page-card-text">
            <h1 className="landing-page-card-title">Watch everywhere.</h1>
            <h2 className="landing-page-card-subtitle">
              Stream unlimited movies and TV shows on your phone, tablet, laptop
              and TV.
            </h2>
          </div>

          <div className="story-card-img-container">
            <div className="story-card-animation-container">
              <img
                src={CardImg1}
                alt=""
                className="story-card-img"
                style={{ zIndex: "100" }}
              ></img>
              <div className="story-card-animation">
                <video
                  className="story-card-video"
                  playsInline
                  muted
                  loop
                  autoPlay
                >
                  <source src={CardVideo2} type="video/mp4"></source>
                </video>
              </div>
            </div>
          </div>
        </section>

        <section
          className="landing-page-cards"
          style={{ borderBottom: "8px solid #222" }}
        >
          <div className="story-card-img-container">
            <div className="story-card-animation-container">
              <img
                src={CardImg4}
                alt=""
                className="story-card-img"
                style={{ zIndex: "100" }}
              ></img>
            </div>
          </div>

          <div className="landing-page-card-text">
            <h1 className="landing-page-card-title">
              Create profile for kids.
            </h1>
            <h2 className="landing-page-card-subtitle">
              Send kids on adventures with their favorite characters in a space
              made just for them-free with your membership.
            </h2>
          </div>
        </section>

        <section className="landing-page-list">
          <h1>Frequently Asked Questions</h1>
          <div className="accordion-menu">
            <div className="landing-list-item">
              <button
                className="landing-list-item-title"
                onClick={() => setShowAnswer1(!showAnswer1)}
              >
                <span>What is Netflix Clone?</span>
                {showAnswer1 ? (
                  <RemoveIcon fontSize="large" />
                ) : (
                  <AddIcon fontSize="large" />
                )}
              </button>
              <p
                className={
                  showAnswer1
                    ? "landing-list-item-text"
                    : "landing-list-item-text-disappear"
                }
              >
                Netflix Clone is a streaming service that offers a wide variety
                of award-winning TV shows, movies, anime, documentaries, and
                more on thousands of internet-connected devices.
                <br></br>
                <br></br>
                You can watch as much as you want, whenever you want without a
                single commercial - all for one low monthly price. There's
                always something new to discover and new TV shows and movies are
                added every week!
              </p>
            </div>

            <div className="landing-list-item">
              <button
                className="landing-list-item-title"
                onClick={() => setShowAnswer2(!showAnswer2)}
              >
                <span>How much does Netflix Clone cost?</span>
                {showAnswer2 ? (
                  <RemoveIcon fontSize="large" />
                ) : (
                  <AddIcon fontSize="large" />
                )}
              </button>
              <p
                className={
                  showAnswer2
                    ? "landing-list-item-text"
                    : "landing-list-item-text-disappear"
                }
              >
                Watch Netflix Clone on your smartphone, tablet, Smart TV,
                laptop, or streaming device, all for one fixed monthly fee.
                Plans range from 7.99 USD to 11.99 USD a month. No extra costs,
                no contracts.
              </p>
            </div>

            <div className="landing-list-item">
              <button
                className="landing-list-item-title"
                onClick={() => setShowAnswer3(!showAnswer3)}
              >
                <span>Where can I watch?</span>
                {showAnswer3 ? (
                  <RemoveIcon fontSize="large" />
                ) : (
                  <AddIcon fontSize="large" />
                )}
              </button>
              <p
                className={
                  showAnswer3
                    ? "landing-list-item-text"
                    : "landing-list-item-text-disappear"
                }
              >
                Watch anywhere, anytime, on an unlimited number of devices. Sign
                in with your Netflix Clone account to watch instantly on the web
                at netflixclone.com from your personal computer or on any
                internet-connected devices.
                <br></br>
                <br></br>
                You can also download your favorite shows with the iOS, Android,
                or Windows 10 app. Use downloads to watch while you're on the go
                and without an internet connection. Take Netflix Clone with you
                anywhere.
              </p>
            </div>

            <div className="landing-list-item">
              <button
                className="landing-list-item-title"
                onClick={() => setShowAnswer4(!showAnswer4)}
              >
                <span>How do I cancel?</span>
                {showAnswer4 ? (
                  <RemoveIcon fontSize="large" />
                ) : (
                  <AddIcon fontSize="large" />
                )}
              </button>
              <p
                className={
                  showAnswer4
                    ? "landing-list-item-text"
                    : "landing-list-item-text-disappear"
                }
              >
                Netflix Clone is flexible. There are no pesky contracts and no
                commitments. You can easily cancel your account online in two
                clicks. There are no cancellation fees - start or stop your
                account anytime.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-tabs">
          <div className="landing-tabs-container">
            {/* <div id="tab-1" className="tab-item tab-border "> */}
            <div
              id="tab-1"
              className={
                toggleTabs === 1 ? "tab-item active-tab-item" : "tab-item"
              }
              onClick={() => handleTabsToggle(1)}
            >
              <MeetingRoomIcon fontSize="large" />
              <p className="hide-sm">Cancel anytime</p>
            </div>
            <div
              id="tab-2"
              className={
                toggleTabs === 2 ? "tab-item active-tab-item" : "tab-item"
              }
              onClick={() => handleTabsToggle(2)}
            >
              <TabletAndroidIcon fontSize="large" />
              <p className="hide-sm">Watch anywhere</p>
            </div>
            <div
              id="tab-3"
              className={
                toggleTabs === 3 ? "tab-item active-tab-item" : "tab-item"
              }
              onClick={() => handleTabsToggle(3)}
            >
              <StyleIcon fontSize="large" />
              <p className="hide-sm">Pick your price</p>
            </div>
          </div>
        </section>

        <section className="landing-tabs-content">
          <div className="landing-tabs-content-container">
            {/* Tab Content 1 */}
            <div
              id="tab-1-content"
              className={
                toggleTabs === 1
                  ? "tab-content-item  active-tab-content-item"
                  : "tab-content-item"
              }
            >
              <div className="tab-1-content-inner">
                <div>
                  <p className="text-large">
                    If you decide Netflix isn't for you - no problem. No
                    commitment. Cancel online anytime.
                  </p>
                  <a href="#" className="landing-btn landing-btn-large">
                    Watch Free For 30 days
                  </a>
                </div>
                <img
                  src="https://i.ibb.co/J2xDJV7/tab-content-1.png"
                  alt=""
                ></img>
              </div>
            </div>

            <div
              id="tab-2-content"
              className={
                toggleTabs === 2
                  ? "tab-content-item  active-tab-content-item"
                  : "tab-content-item"
              }
            >
              <div className="tab-2-content-top">
                <p className="text-large">
                  Watch TV shows and movies anytime, anywhere - personalized for
                  you.
                </p>
                <a href="#" className="landing-btn landing-btn-large">
                  Watch Free For 30 days
                </a>
              </div>
              <div className="tab-2-content-bottom">
                <div>
                  <img
                    src="https://i.ibb.co/DpdN7Gn/tab-content-2-1.png"
                    alt=""
                  />
                  <p class="text-medium">Watch on your TV</p>
                  <p class="text-dark">
                    Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray
                    players and more.
                  </p>
                </div>
                <div>
                  <img
                    src="https://i.ibb.co/R3r1SPX/tab-content-2-2.png"
                    alt=""
                  />
                  <p class="text-medium">
                    Watch instantly or download for later
                  </p>
                  <p class="text-dark">
                    Available on phone and tablet, wherever you go.
                  </p>
                </div>
                <div>
                  <img
                    src="https://i.ibb.co/gDhnwWn/tab-content-2-3.png"
                    alt=""
                  />
                  <p class="text-medium">Use any computer</p>
                  <p class="text-dark">Watch right on Netflix.com.</p>
                </div>
              </div>
            </div>

            {/* Tab 3 Content */}
            <div
              id="tab-3-content"
              className={
                toggleTabs === 3
                  ? "tab-content-item  active-tab-content-item"
                  : "tab-content-item"
              }
            >
              <div className="text-center">
                <p className="text-large">
                  Choose one plan and watch everything on Netflix
                </p>
                <a href="#" className="landing-btn landing-btn-large">
                  Watch Free For 30 days
                </a>
              </div>

              <table className="landing-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Basic</th>
                    <th>Standard</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monthly price after free month ends on 6/19/19</td>
                    <td>$8.99</td>
                    <td>$12.99</td>
                    <td>$15.99</td>
                  </tr>
                  <tr>
                    <td>HD Available</td>
                    <td>
                      <CloseIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td>Ultra HD Available</td>
                    <td>
                      <CloseIcon />
                    </td>
                    <td>
                      <CloseIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td>Screens you can watch on at the same time</td>
                    <td>1</td>
                    <td>2</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>Watch on your laptop, TV, phone and tablet</td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td>Unlimited movies and TV shows</td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td>Cancel anytime</td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td>First month free</td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                    <td>
                      <CheckIcon />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
