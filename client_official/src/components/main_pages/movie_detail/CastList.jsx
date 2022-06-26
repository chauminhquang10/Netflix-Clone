import React, { useState } from "react";

const CastList = ({ actors }) => {
  const [casts, setCasts] = useState([
    {
      name: "Brad Dourif",
      img: "https://www.themoviedb.org/t/p/w138_and_h175_face/3bE8jZyPaOASww11gOwLP7QW0IY.jpg",
    },
    {
      name: "Alyvia Alyn",
      img: "https://www.themoviedb.org/t/p/w138_and_h175_face/gS0BXE5CL7F3TZDxaj8vEQtY0Ym.jpg",
    },
    {
      name: "Avery Esteves",
      img: "https://www.themoviedb.org/t/p/w138_and_h175_face/njhRRPFhKFSoRo0y5sQVzL4Dc6h.jpg",
    },
    {
      name: "India Brown",
      img: "https://www.themoviedb.org/t/p/w138_and_h175_face/2p7XrYFFtgHDG25fPcrSJxw2buM.jpg",
    },
    {
      name: "Tara Moayedi",
      img: "https://www.themoviedb.org/t/p/w138_and_h175_face/yMKLIW8R4RuP7eAgMA2zYlhvOqb.jpg",
    },
  ]);
  return (
    <div className="casts">
      {actors.map((cast, index) => (
        <div key={index} className="casts__item">
          <div
            className="casts__item__img"
            style={{ backgroundImage: `url(${cast.image})` }}
          ></div>
          <p className="casts__item__name">{cast.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CastList;
