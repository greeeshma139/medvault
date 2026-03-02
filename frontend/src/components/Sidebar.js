import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  activeSection,
  setActiveSection,
  onLogout,
  userRole = "professional",
}) => {
  const { user } = useAuth();

  return (
    <aside className={`sidebar-new ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2 style={{ display: sidebarOpen ? "block" : "none" }}>MedVault</h2>
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse" : "Expand"}
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <div
        className="user-card"
        style={{ display: sidebarOpen ? "block" : "none" }}
      >
        <div className="avatar-large">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
        <h3>
          {userRole === "professional" ? "Dr. " : ""}
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="subtitle">{user?.email}</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
              title={sidebarOpen ? "" : item.label}
            >
              <span className="nav-icon">
                <IconComponent size={18} />
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <FiLogOut size={16} />
        {sidebarOpen && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
