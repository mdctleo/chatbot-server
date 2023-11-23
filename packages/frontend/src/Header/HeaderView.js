import { useNavigate } from "react-router-dom";
import { Settings24Regular } from "@fluentui/react-icons";
import "./HeaderView.css";

export function HeaderView() {
  const navigate = useNavigate();

  return (
    <div className="header-bar">
      <button onClick={() => navigate("/config")}>
        <Settings24Regular />
      </button>
    </div>
  );
}
