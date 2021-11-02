import React, { useState, useRef, useEffect } from "react";

const VideoList = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";
    iframeRef.current.setAttribute("height", height);
  }, []);
  return (
    <div className="video">
      <div className="video__title">
        <h2>Trailer</h2>
      </div>
      <iframe
        src="https://res.cloudinary.com/minh-quang-21-kg/video/upload/v1633534597/TestMovie/Little_Blue_Penguin.MP4_ea7rts.mp4"
        ref={iframeRef}
        width="100%"
        title="video"
      ></iframe>
    </div>
  );
};

export default VideoList;
