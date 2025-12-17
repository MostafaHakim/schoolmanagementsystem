import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Arrival = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("./login");
  }, []);
};

export default Arrival;
