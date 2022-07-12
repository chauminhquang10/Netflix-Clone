import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const SkeletonList = () => {
  return (
    <div className="list">
      <div className="list_header">
        <span className="listTitle">
          <Skeleton width={150} height={30} />
        </span>
        <Skeleton width={100} height={30} />
      </div>
      <div style={{ position: "relative" }}>
        <Swiper
          style={{ overflow: "hidden" }}
          id="main"
          tag="section"
          wrapperTag="ul"
          navigation
          slidesPerView={6}
          loop={true}
        >
          {Array(5)
            .fill(0)
            .map((movie, index) => (
              <SwiperSlide style={{ listStyle: "none" }} key={index} tag="li">
                <Skeleton count={1} height={120} width={225} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SkeletonList;
