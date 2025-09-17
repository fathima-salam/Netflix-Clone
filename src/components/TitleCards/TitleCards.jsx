import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import cards_data from "../../assets/cards/Cards_data";
import { Link } from "react-router-dom";

const TitleCards = ({title,category}) => {

    const [apiData,setApiData] = useState([])
  const cardsRef = useRef();

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTRlNzc5NmMwNmRlZDlhN2Q5NGE2YmE4OGYwYzk1ZSIsIm5iZiI6MTc1Nzg1ODEyOS44MDMsInN1YiI6IjY4YzZjOTUxZTQ0ZmRhZTk5OWYyMWQzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Zq9Tb9DsphrEdvfRNWI-clqgTGXo3RUo1vj3IRsIfUc'
  }
};


  const handelWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`, options)
    .then(res => res.json())
    .then(res => setApiData(res.results))
    .catch(err => console.error(err));

    cardsRef.current.addEventListener("wheel", handelWheel);
  }, []);

  return (
    <div className="titleCards">
      <h1>{ title ? title : 'Popular on Netflix' }</h1>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <Link to={`/player/${card.id}`} className="card" key={index}>
              <img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt="" />
              <p>{card.original_title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;


{/* <div className="card-list" ref={cardsRef}></div> */}
