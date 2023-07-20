import navStyles from "./Navbar.module.css";
import { NavLink , Link} from "react-router-dom";

function Navbar() {
    return (
        <>
            <div className={navStyles.bar}>
                <div >
                    SwiftBuy
                </div>
                <div className={navStyles.rightSide}>
                    <div>Home</div>
                    <Link className={navStyles.nav} to="sign-in"><div >SignIn</div></Link>
                </div>
            </div>
        </>
    )
}

export {Navbar};