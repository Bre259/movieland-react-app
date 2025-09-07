import React from "react";

const MovieCard = ({ movie: { imdbID, Year, Poster, Title, Type } }) => {
  const placeholder = "https://via.placeholder.com/400x600?text=No+Image";
  const safePoster = Poster && Poster !== "N/A"
    ? Poster.startsWith("http://") ? Poster.replace("http://", "https://") : Poster
    : placeholder;

  return (
    <div className="movie">
      <div>
        <p>{Year}</p>
      </div>
      <div>
        <img
          src={safePoster}
          alt={Title}
          loading="lazy"
          decoding="async"
          onError={(e) => { if (e.currentTarget.src !== placeholder) e.currentTarget.src = placeholder; }}
        />
      </div>
      <div>
        <span>{Type}</span>
        <h3>{Title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
