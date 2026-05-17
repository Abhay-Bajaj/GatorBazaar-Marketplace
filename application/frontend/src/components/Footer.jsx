import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text">© 2026 GatorBazaar. All rights reserved.</p>
                <div className="footer-links">
                    <Link className="team-button team-button-bottom" to="/teamMembers">
                        Team Members
                    </Link>
                </div>
            </div>
        </footer>
    )
}