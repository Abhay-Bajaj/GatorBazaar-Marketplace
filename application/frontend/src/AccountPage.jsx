import NavigationSearchBar from './components/NavigationSearchBar'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./App.css"
import "./AccountPage.css";
import ListingCard from './components/ListingCard'


export default function AccountPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [recentFavorites, setRecentFavorites] = useState([])
    const [userListings, setUserListings] = useState([])
    const [activeTab, setActiveTab] = useState('purchased')

    useEffect(() => {
        async function fetchAccountData() {
            try {
                const [userRes, favoritesRes, listingsRes] = await Promise.all([
                    fetch('/api/user/loggedUser', {
                        credentials: 'include',
                    }),

                    fetch('/api/favorites', {
                        credentials: 'include'
                    }),

                    fetch('/api/items/my-listings', {
                        credentials: 'include'
                    })
                ])

                const userData = await userRes.json()
                const favoritesData = await favoritesRes.json()
                const listingsData = await listingsRes.json()

                setUser(userData.userInfo)
                setRecentFavorites(favoritesData)
                setUserListings(listingsData.soldListings)

                console.log("user", user)
                console.log("listings", userListings)
                console.log("favs", recentFavorites)

            } catch (err) {
                console.error('Failed to fetch account data:', err)
            }
        }

        fetchAccountData()
    }, [])

    function handleSearch(event) {
        event.preventDefault()
        const params = new URLSearchParams()
        if (query.trim()) params.set('q', query.trim())
        navigate(`/search?${params.toString()}`)
    }

    async function handleChangePassword(event) {
        event.preventDefault()

        setPasswordError('')
        setPasswordSuccess('')

        if (password !== confirmedPassword) {
            setPasswordError('Passwords do not match')
            return
        }

        if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordError('Password must be at least 8 characters, contain atleast 1 number, and atleast 1 special character')
            return
        }

        try {
            const res = await fetch('http://localhost:3000/auth/changePassword', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setPasswordError(data.error || 'Failed to change password')
                return
            }

            setPasswordSuccess('Password successfully changed!')

            setCurrentPassword('')
            setPassword('')
            setConfirmedPassword('')

        } catch (err) {
            console.error(err)
            setPasswordError('Server error')
        }
    }

    if (!user) return <div>User not found.</div>;

    const date_joined = new Date(user.joinedDate).toLocaleDateString();

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
                <div className="account-main-row">
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
                                <p><strong>Name:</strong> {user.fullname}</p>
                                <p><strong>Username:</strong> {user.username}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Member since:</strong> {date_joined}</p>
                            </div>

                        </div>
                    </div>
                    <div className="account-section">
                        <div className="account-tabs">

                            <button
                                className={activeTab === 'purchased' ? 'active' : ''}
                                onClick={() => setActiveTab('purchased')}
                            >
                                Purchased
                            </button>

                            <button
                                className={activeTab === 'favorites' ? 'active' : ''}
                                onClick={() => setActiveTab('favorites')}
                            >
                                Favorites
                            </button>

                            <button
                                className={activeTab === 'settings' ? 'active' : ''}
                                onClick={() => setActiveTab('settings')}
                            >
                                Settings
                            </button>
                        </div>

                        {activeTab === 'settings' && (
                            <div className="settings-card">
                                <h2>Settings</h2>

                                <div className="settings-stack">

                                    <h3>Change Password</h3>

                                    <form className="settings-form" onSubmit={handleChangePassword}>
                                        <div className="form-group">
                                            <label>Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Enter current password"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter new password"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={confirmedPassword}
                                                onChange={(e) => setConfirmedPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        {passwordError && (
                                            <p className="form-error">{passwordError}</p>
                                        )}

                                        {passwordSuccess && (
                                            <p className="form-success">{passwordSuccess}</p>
                                        )}
                                        <button type="submit">
                                            Update Password
                                        </button>

                                    </form>


                                </div>
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="account-tab-panel">
                                <h2 className="account-tab-header">Recent Favorites</h2>
                                <div className="account-listings-row">
                                    {recentFavorites.slice(0, 4).map((item) => (
                                        <ListingCard
                                            key={item.listing_id}
                                            id={item.listing_id}
                                            title={item.title}
                                            price={item.price}
                                            image={item.image_url || 'placeholder'}
                                            //category_name={item.category_name}
                                            isFavorited={true}
                                        />
                                    ))}
                                </div>
                                <div className="account-tab-footer">
                                    <button
                                        className="account-tab-button"
                                        onClick={() => navigate('/favorites')}
                                    >
                                        View All Favorites
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'purchased' && (
                            <div className="account-tab-panel">
                                <h2 className="account-tab-header">Recent Purchases</h2>
                                <div className="account-listings-row">
                                    {userListings.slice(0, 4).map((item) => (
                                        <ListingCard
                                            key={item.listing_id}
                                            id={item.listing_id}
                                            title={item.title}
                                            price={item.price}
                                            image={item.image_url || 'placeholder'}
                                            //category_name={item.category_name}
                                            isOwner={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

