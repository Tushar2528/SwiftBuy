import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar1 } from "../Navbar1/Navbar1";
import { Home } from "../Home/Home";
import { Cart } from "../Cart/Cart";


const Testing = () => {
    const location = useLocation();

    const [isHome, setIsHome] = useState(true);


    return (
        <>
            <Navbar1/>
            {location.pathname.includes("/cart") ? <Cart/> : <Home/>}
        </>
    )
}

export default Testing;

