import { useMemo } from "react";
import { getNavbarItems } from "../controller/navbarcontroller";
import "../styles/navbar.css";

type NavbarProps = {
  activePage: string;
  setActivePage: (page: string) => void;
};

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const items = getNavbarItems();

  const user = useMemo(() => {
    const name = localStorage.getItem("userName") || "Guest User";
    const email = localStorage.getItem("userEmail") || "";
    const initial = name.trim().charAt(0).toUpperCase() || "U";
    return { name, email, initial };
  }, []);

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-title">Skill Sync</div>

        <nav className="sidebar-nav">
          <ul>
            {items.map((item, idx) => (
              <li
                key={idx}
                className={activePage === item.page ? "active" : ""}
                onClick={() => setActivePage(item.page)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-avatar">{user.initial}</span>
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{user.name}</span>
            {user.email && (
              <span className="sidebar-user-email">{user.email}</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}