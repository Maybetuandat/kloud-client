import { FC } from "react";
import { Logo } from "@/widgets";
import { Link } from "react-router-dom";

const LayoutHeader: FC = () => {
  return (
    <>
      <header>
        <nav className="navbar bg-base-100">
        
          <Logo logoName={"imissu"} />
          <div className="navbar-end">
            <Link to="/" className="btn-ghost btn">
              <h4>Dashboard</h4>
            </Link>

            <Link to="/courses" className="btn-ghost btn">
              <h4>Course</h4>
            </Link>

            <Link to="/history" className="btn-ghost btn">
              <h4>History</h4>
            </Link>

            <button className="btn-ghost btn">
              <h4>Pricing</h4>
            </button>

            <button className="btn-ghost btn">
              <h4>Learning Path</h4>
            </button>

            <button className="btn-ghost btn-circle btn">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="badge badge-primary badge-xs indicator-item"></span>
              </div>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default LayoutHeader;
