import main from "../assets/images/jobhunt.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
import { Link, Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import React from "react";
import { FaGithub } from "react-icons/fa";

const Landing = () => {
  const { user } = useAppContext();
  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/* info */}
          <div className="info">
            <h1>
              job <span>tracking</span> app
            </h1>
            <p>
              I`m baby fam direct trade blackbird spyplane, bespoke skateboard
              raclette gatekeep trust fund air plant yes plz mumblecore etsy
              cred retro thundercats. Cornhole post-ironic sriracha kogi, tofu
              hella kale chips yr master cleanse chillwave four dollar toast.
              Lyft brunch mixtape af paleo fingerstache chicharrones locavore
              pitchfork.
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/patrick022/JobForte-MERN-production"
              className="btn btn-hero"
              style={{ marginRight: "18px", paddingTop: "8px" }}
            >
              Github
              <FaGithub style={{ marginLeft: "10px", height: "15px" }} />
            </a>
            <Link to="/register" className="btn btn-hero">
              Login/Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default Landing;
