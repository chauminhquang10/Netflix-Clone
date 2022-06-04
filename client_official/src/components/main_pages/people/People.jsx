import React from "react";
import "./style.scss";

const Person = {
  Name: "Mads Mikkelsen",
  Biography: [
    `Mads Dittmann Mikkelsen (born 22 November 1965) is a Danish actor. Originally a gymnast and dancer, he rose to fame in Denmark as an actor for his roles such as Tonny in the first two films of the Pusher film trilogy (1996, 2004), Detective Sergeant Allan Fischer in the television series Rejseholdet (2000–2004), Niels in Open Hearts (2002), Svend in The Green Butchers (2003), Ivan in Adam's Apples (2005) and Jacob Petersen in After the Wedding (2006).`,
    `Mikkelsen achieved worldwide recognition for playing the main antagonist Le Chiffre in the twenty-first James Bond film, Casino Royale (2006). His other roles include Igor Stravinsky in Coco Chanel & Igor Stravinsky (2008), Johann Friedrich Struensee in A Royal Affair (2012), his Cannes Film Festival Best Actor Award-winning performance as Lucas in the Danish film The Hunt (2012), Dr. Hannibal Lecter in the television series Hannibal (2013–2015), Kaecilius in Marvel's Doctor Strange (2016), Galen Erso in Lucasfilm's Rogue One (2016), Cliff Unger in Hideo Kojima's video game Death Stranding (2019), and his BAFTA-nominated role as Martin in Another Round (2020).`,
    `A. O. Scott of The New York Times remarked that in the Hollywood scene, Mikkelsen has "become a reliable character actor with an intriguing mug" but stated that on the domestic front "he is something else: a star, an axiom, a face of the resurgent Danish cinema"`,
  ],
  Known_for: [
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
    {
      title: "Trang Đại Phu",
      img: "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      id: "1",
    },
  ],
  info: {
    Known_For: "Acting",
    Acting: "66",
    Known_Credits: "Male",
    Gender: "Male",
    Birthday: "965-11-22 (56 years old)",
    Place_of_Birth: "Copenhagen, Denmark",
    Also_Known_As: [
      "Mads Dittmann Mikkelsen",
      "Mads Dittman Mikkelsen",
      "Mads D. Mikkelsen",
      "マッツ・ミケルセン",
      "Мадс Миккельсен",
      "مادس ميكلسن",
      "麦斯·米科尔森",
      "매즈 미켈슨",
      "Мадс Міккельсен",
      "Μαντς Μίκελσεν",
    ],
  },
};
const People = () => {
  return (
    <>
      <section className="section-people-page">
        <div className="people-page-container">
          <div className="left-column-container">
            <div className="left-column-img">
              <img src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ntwPvV4GKGGHO3I7LcHMwhXfsw9.jpg"></img>
            </div>
            <div className="left-column-media">
              <div className="media-item">FB</div>
              <div className="media-item">TW</div>
              <div className="media-item">IS</div>
            </div>
            <div className="left-column-info">
              <div className="column-title">Personal info</div>
              <div className="info-item">
                <div className="info-title">Know For</div>
                <div className="info-text">{Person.info.Known_For}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Known Credits</div>
                <div className="info-text">{Person.info.Known_Credits}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Gender</div>
                <div className="info-text">{Person.info.Gender}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Birthday</div>
                <div className="info-text">{Person.info.Birthday}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Place of Birth</div>
                <div className="info-text">{Person.info.Place_of_Birth}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Also Known As</div>
                <div className="info-text">
                  {Person.info.Also_Known_As.map((text) => {
                    return <div>{text}</div>;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="right-column-container">
            <div className="right-column-title">{Person.Name}</div>
            <div className="right-column-bio">
              <div className="bio-title">Biography</div>
              <div className="bio-content">
                {Person.Biography.map((item) => {
                  return <p>{item}</p>;
                })}
              </div>
            </div>
            <div className="know-for">
              <div className="item-container">
                {Person.Known_for.map((item) => {
                  return (
                    <div className="know-for-item">
                      <div className="item-img">
                        <img src={item.img}></img>
                      </div>
                      <div className="item-title">{item.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default People;
