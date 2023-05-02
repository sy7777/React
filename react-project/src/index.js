import React from "react";
import { createRoot } from "react-dom/client";
// create element
const root = createRoot(document.querySelector("#root"));
const categories = [
  { id: 1, name: "Recommend" },
  { id: 2, name: "Meal for one" },
  { id: 3, name: "Salad" },
  { id: 4, name: "Main course" },
  { id: 5, name: "Entree" },
];

root.render(
  <div>
    <ul>
      {categories.map((item,index) => {
        return (
          <li key={item.id}>
            {index === 0 && (
              <img
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iconexperience.com%2Fg_collection%2Ficons%2F%3Ficon%3Dshopping_cart&psig=AOvVaw2V60RRpinPhYlChpoGNuKz&ust=1682999207837000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCMj3pOGa0_4CFQAAAAAdAAAAABAE"
                alt="cart"
              />
            )}

            {item.name}
          </li>
        );
      })}
    </ul>
  </div>
);
