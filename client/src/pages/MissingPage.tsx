import { useNavigate, useLocation } from "react-router-dom";
import "./main.css";

interface MissingPageProps {
  rootPath: string;
}

const MissingPage = (props: MissingPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const onClick = () => {
    navigate(location.state?.from?.pathname || props.rootPath, {
      replace: true,
    });
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "white",
      }}
    >
      <p
        style={{
          fontSize: "30px",
        }}
      >
        The page you are looking for does not exist
      </p>
      <button className="public-register-btn passenger-btn" onClick={onClick}>
        Return
      </button>
    </div>
  );
};

export default MissingPage;
