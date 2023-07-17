import { Link } from "react-router-dom";
import style from "./LandingPage.module.css"



const LandingPage = () => {
  return (
    <div className={style.containerLandingPage}>
      <div className={style.containerButtonLanding}>
      <Link to="/home">
       <button className={style.buttonLandingPage}>Poke Explore</button>
      </Link>
      </div>
    </div>
  );
};

export default LandingPage;
