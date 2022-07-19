import React, { useState, useRef } from "react";
import { Button } from "../button/Button";
import { Close } from "@material-ui/icons";
import "./Modal.scss";

const Herosection = () => {
  const [active, setActive] = useState(false);

  const iframeRef = useRef(null);

  const closeModal = () => {
    iframeRef.current.setAttribute("src", "");
    setActive(!active);
  };

  const openModal = () => {
    iframeRef.current.setAttribute(
      "src",
      "https://res.cloudinary.com/minh-quang-21-kg/video/upload/v1633534597/TestMovie/Little_Blue_Penguin.MP4_ea7rts.mp4"
    );
    setActive(!active);
  };

  return (
    <div>
      <Button onClick={openModal}>Open</Button>

      <div className={`modal ${active ? "active" : ""}`} onClick={closeModal}>
        <div className="modal__content">
          <iframe
            ref={iframeRef}
            width="100%"
            height="500px"
            title="trailer"
          ></iframe>
          <div className="modal__content__close" onClick={closeModal}>
            <Close />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Herosection;
