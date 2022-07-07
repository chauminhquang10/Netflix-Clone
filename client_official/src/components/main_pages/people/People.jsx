import React, { useState, useContext, useEffect } from "react";
import "./style.scss";
import { GlobalState } from "../../../GlobalState";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Person = {
  name: "",
  image: "",
  gender: "",
  place_of_birth: "",
  birthday: "",
  biography: "",
  tmdbID: "",
  knownFor: [],
};
const People = () => {
  const state = useContext(GlobalState);
  const params = useParams();
  const [actor, setActor] = useState(Person);
  const [actors, setActors] = state.actorsAPI.actors;

  useEffect(() => {
    const getDetailActor = async () => {
      if (params.id) {
        try {
          const res = await axios.get(`/api/actors/${params.id}`);
          if (res !== null) {
            setActor(res.data.actor);
            console.log(res.data.actor);
          }
        } catch (error) {
          alert(error.response.data.msg);
        }
      }
    };
    getDetailActor();
  }, [params.id]);

  return (
    <>
      <section className="section-people-page">
        <div className="people-page-container">
          <div className="left-column-container">
            <div className="left-column-img">
              <img src={actor.image}></img>
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
                {/* <div className="info-text">{actor.knownFor}</div> */}
              </div>
              <div className="info-item">
                <div className="info-title">Gender</div>
                <div className="info-text">{actor.gender}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Birthday</div>
                <div className="info-text">{actor.birthday}</div>
              </div>
              <div className="info-item">
                <div className="info-title">Place of Birth</div>
                <div className="info-text">{actor.place_of_birth}</div>
              </div>
            </div>
          </div>
          <div className="right-column-container">
            <div className="right-column-title">{actor.name}</div>
            <div className="right-column-bio">
              <div className="bio-title">Biography</div>
              <div className="bio-content">
                {actor.biography.replace(
                  "From Wikipedia, the free encyclopedia",
                  ""
                )}
              </div>
            </div>
            <div className="know-for">
              <div className="item-container">
                {actor.knownFor.map((item) => {
                  return (
                    <Link to={`/detail/${item._id}`}>
                      <div className="know-for-item">
                        <div className="item-img">
                          <img src={item.imgSmall}></img>
                        </div>
                        <div className="item-title">{item.title}</div>
                      </div>
                    </Link>
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
