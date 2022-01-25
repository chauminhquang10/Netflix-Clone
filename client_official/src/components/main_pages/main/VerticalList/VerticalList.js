import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from "swiper";
import "swiper/swiper-bundle.css";
import "./VerticalList.scss";
import React, { useState } from "react";
import ItemLeft from "./VerticalListItem/VerticalListLeftItem";
import ItemRight from "./VerticalListItem/VerticalListRightItem";

SwiperCore.use([Navigation, Pagination, Controller, Thumbs]);

export default function VerticalList({ title, movies }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    //<React.Fragment>
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="VerticalList_Container">
        <div className="VerticalList_Container_Right">
          <Swiper
            navigation
            id="main"
            thumbs={{ swiper: thumbsSwiper }}
            controller={{ control: thumbsSwiper }}
            loop="true"
            tag="section"
            wrapperTag="ul"
            spaceBetween={0}
            slidesPerView="auto"
          >
            {movies.map((movie, index) => (
              <SwiperSlide
                style={{ listStyle: "none" }}
                key={`slide-${index}`}
                tag="li"
              >
                {/* <ListItem SetMovie={handleChangeMovie} movie={movie}></ListItem> */}
                <ItemRight movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="VerticalList_Container_Left">
          <Swiper
            pagination
            loop="true"
            direction="vertical"
            id="thumbs"
            spaceBetween={0}
            slidesPerView={3}
            onSwiper={setThumbsSwiper}
            style={{ overflow: "hidden", height: "510px" }}
          >
            {movies.map((movie, index) => (
              <SwiperSlide
                style={{ listStyle: "none" }}
                key={`slide-${index}`}
                tag="li"
              >
                {/* <ListItem SetMovie={handleChangeMovie} movie={movie}></ListItem> */}
                <ItemLeft movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
    //</React.Fragment>
  );
}
