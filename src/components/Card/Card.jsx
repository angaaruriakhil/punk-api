import React, { useState } from "react";
import "./Card.scss";
import beerSvg from "../../assets/images/beer.svg";

const Card = (props) => {
  const { name, tagline, firstBrewed, description, abv, pH, imageUrl } = props;
  const [showImg, setShowImg] = useState(true);

  return (
    <div className="card">
      <div className="card__item-1">
        {showImg ? (
          <img
            className="card__item-1__img"
            src={imageUrl}
            alt={name || "beer"}
            loading="lazy"
            onError={() => setShowImg(false)}
          />
        ) : (
          <img src={beerSvg} alt="beer icon" className="beer-icon" />
        )}

        <p className="card__item-1__abv">abv: {abv}</p>
        <p className="card__item-1__ph">pH: {pH}</p>
      </div>

      <div className="card__item-2">
        <h2 className="card__item-2__name">{name}</h2>
        <p className="card__item-2__first-brewed">
          First Brewed: {firstBrewed}
        </p>
        <h4 className="card__item-2__tagline">{tagline}</h4>
        <p className="card__item-2__description">{description}</p>
      </div>
    </div>
  );
};

export default Card;
