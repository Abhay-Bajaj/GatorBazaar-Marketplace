import NavigationSearchBar from './components/NavigationSearchBar'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./AccountPage.css";

export default function AccountPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState('')

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`/api/user/`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }

        fetchUser();
    }, []);

    function handleSearch(event) {
        event.preventDefault()
        const params = new URLSearchParams()
        if (query.trim()) params.set('q', query.trim())
        navigate(`/search?${params.toString()}`)
    }

    if (!user) return <div>User not found.</div>;

    const date_joined = new Date(user.created_at).toLocaleDateString();

    return (
        <div className="account-page">
            <NavigationSearchBar
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
                onSellClick={() => navigate('/create-listing')}
                onMessagesClick={() => navigate('/inbox')}
                onFavoritesClick={() => { }}
                placeholder="Search marketplace items"
                searchButtonText="Search"
            />

            <div className="account-content">

                <div className="account-section">
                    <h2>My Profile</h2>

                    <div className="profile-row">

                        <div className="profile-image-container">
                            <img
                                src="/images/profile-placeholder.png"
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>

                        <div className="profile-info">
                            <p><strong>Name:</strong> {"Alice"}</p>
                            <p><strong>Username:</strong> {"aliceEX"}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Member since:</strong> {date_joined}</p>
                        </div>

                    </div>
                </div>
                <div className="account-section">
                    <h2>Settings</h2>

                    <div className="settings-stack">

                        <div className="settings-card">
                            <h3>Change Username</h3>

                            <form className="settings-form">
                                <div className="form-group">
                                    <label>New Username</label>
                                    <input type="text" placeholder="Enter new username" />
                                </div>

                                <button type="submit" disabled>
                                    Update Username
                                </button>
                            </form>
                        </div>

                        <div className="settings-card">
                            <h3>Change Password</h3>

                            <form className="settings-form">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input type="password" placeholder="Enter current password" />
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Enter new password" />
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" placeholder="Confirm new password" />
                                </div>

                                <button type="submit" disabled>
                                    Update Password
                                </button>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

