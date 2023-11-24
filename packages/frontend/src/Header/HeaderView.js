import { useNavigate } from "react-router-dom";
import { Settings24Regular, Chat24Regular } from "@fluentui/react-icons";
import "./HeaderView.css";

export function HeaderView() {
  const navigate = useNavigate();

  return (
    <div className="header-bar">
      <button onClick={() => navigate("/")}>
        <Chat24Regular />
      </button>
      <button onClick={() => navigate("/config")}>
        <Settings24Regular />
      </button>
    </div>
  );
}
