import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/");
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
        console.error(error);
      }
    };
  });

  return (
    <div>
      <Navbar />
      <Sidebar />
    </div>
  );
}
