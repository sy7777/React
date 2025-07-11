import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { useReducer, useEffect } from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'; // Assuming you have react-router installed
import ContactPage from './app/contact/page';
import MountainPage from './app/mountain/page';
const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

function App() {
  // const [status, setStatus] = useState(true);
  const [status, toggle] = useReducer((status) => !status, true);
  useEffect(() => {
    console.log(`${status}`);
  }, [status]);
  return (
    <div className='container'>
      <h1>The restaurant is currently {status ? "open" : "closed"}.</h1>
      <button onClick={toggle}>{status ? "closed" : "open"} restaurant</button>
      <Header name="Yuqi" year={new Date().getFullYear()} />
      <nav>
        <Link to="/">Menu</Link> |{" "}
        <Link to="/contact">Contact Us</Link> |{" "}
        <Link to="/mountain">Mountain</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Menu pizza={pizzaData} openStatus={status} onStatus={toggle} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/mountain" element={<MountainPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function Pizza({ name, ingredients, price, photoName, soldOut }) {
  return (
    <li className={`pizza ${soldOut ? 'sold-out' : ''}`}>
      <img src={photoName} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <p>{soldOut ? 'sold out' : price}</p>
      </div>
    </li>

  );
}
// destructure objects in function parameters
// function Header(props){
//   return <h1>{props.name}'s Fast Pizza</h1>
// }

function Header({ name, year }) {
  return (
    <header className="header">
      <h1>{name}'s Fast Pizza in {year}</h1>
    </header>
  );

}

function Menu({ pizza, openStatus, onStatus }) {
  return (
    <div className="menu">
      <button onClick={() => onStatus(true)}>I wanna be open</button>
      <h2>Welcom{""}{openStatus ? "open" : "closed"}</h2>
      <h2>Our menu</h2>
      <ul className="pizzas">
        {pizza.map((pizzaItem) => {
          return <Pizza key={pizzaItem.name} {...pizzaItem} />
        })}
      </ul>
    </div>
  );
}

function Footer() {
  const hour = new Date().getHours();
  const openHour = 9;
  const closeHour = 24;
  const isOpen = hour >= openHour && hour <= closeHour;

  // if(hour >= openHour &&  hour <= closeHour) alert('We are open');
  // else alert('We are closed');
  return (
    <footer className='footer'>
      {isOpen ? (
        <Order closeHour={closeHour} openHour={openHour} />
      ) : (
        <p> We're happy to welcome you between {openHour}:00 and {closeHour}:00.</p>
      )}
    </footer>
  )
  // return React.createElement('footer', null, 'We are currently open')
}

function Order({ closeHour, openHour }) {
  return (
    <div className='order'>
      <p>
        We're open from {openHour}:00 to {closeHour}:00. Come visit us or order
        online.
      </p>
      <button className='btn'>Order</button>
    </div>
  )
}
// react v18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// react before 18
// React.render(<App />);