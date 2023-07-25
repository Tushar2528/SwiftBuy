import nav1Styles from "./Navbar1.module.css";

import cart from "../../Images/carts.png";
import home from "../../Images/home.png";
import order from "../../Images/checklist.png";
import logout from "../../Images/switch.png";
import { useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";


//Import fireStore reference from frebaseInit file
// import {db} from "../firebaseinit";

function Navbar1() {

    const {userid} = useParams();
    // console.log("User id is : ", userid);
    const navigate = useNavigate();

    function gotoCart(){
        navigate(`/${userid}/cart`);
    }

    function gotoOrders(){
        navigate(`/${userid}/orders`);
    }

    function gotoHome(){
        console.log("Logout clicked");
        navigate("/");
    }
    return (
        <>
            <div className={nav1Styles.bar}>
                <div >
                    SwiftBuy
                </div>
               
                <div className={nav1Styles.rightSide}>
                    
                        <div>
                            <div onClick={gotoHome} className={nav1Styles.imageDiv}><img src={home} alt=""></img></div>
                            <div  onClick={gotoHome} className={nav1Styles.nameDiv}>Home</div>
                        </div>
                    

                    
                        <div>
                            <div className={nav1Styles.imageDiv} onClick={gotoOrders}><img src={order} alt=""></img></div>
                            <div className={nav1Styles.nameDiv} onClick={gotoOrders}>My Orders</div>
                        </div>
                    

                    
                        <div>
                            <div className={nav1Styles.imageDiv} onClick={gotoCart}><img src={cart} alt=""></img></div>
                            <div className={nav1Styles.nameDiv} onClick={gotoCart}>Cart</div>
                        </div>
                    

                    
                        <div>
                            <div onClick={gotoHome} className={nav1Styles.imageDiv}><img src={logout} alt=""></img></div>
                            <div onClick={gotoHome} className={nav1Styles.nameDiv}>Logout</div>
                        </div>
                    
                </div>
            </div>
        </>
    )
}

export {Navbar1};