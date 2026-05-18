import { useState, useEffect, use } from "react"
import { useNavigate } from "react-router-dom"
import NavigationSearchBar from "./components/NavigationSearchBar"
import LoginModal from "./components/LoginModal"
import './createListing.css'
import { CreateListingSkeleton, NavBarSkeleton } from "./components/SkeletonLoaders"
import useAuthStatus from "./hooks/useAuthStatus"
import useAccountNavigation from "./hooks/useAccountNavigation"

export default function CreateListing() {
    const {isSignedIn} = useAuthStatus()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        category: "",
        tag: "",
        images: [],
    })
    const [query, setQuery] = useState("")
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const MAX_IMAGES = 9

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])
    const { handleAccountClick } = useAccountNavigation({ isSignedIn, setLoginModalOpen })

    function handleSearch(e) {
        e.preventDefault()
        navigate(`/search?q=${query}`)
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const total = form.images.length + files.length

        if (total > MAX_IMAGES) {
            alert(`You can only upload up to ${MAX_IMAGES} images`)
            return
        }

        setForm(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // basic validation
        if (!form.title || !form.price || !form.category) {
            alert("Please fill in all required fields")
            return
        }

        console.log("Submitting:", form)

        // TODO: send to backend

        navigate("/") // go back home after posting
    }

    if (loading) {
        return <>
            <NavBarSkeleton />
            <CreateListingSkeleton />
        </>
    }

    return ( 
        <div className="create-listing">
            <nav className="nav-bar">
            <NavigationSearchBar
                    query={query}
                    onQueryChange={setQuery}
                    onSearch={handleSearch}
                    onMessagesClick={() => navigate('/inbox')}
                    onProfileClick={handleAccountClick}
                    onSellClick={() => navigate('/create-listing')}
                    onFavoritesClick={() => navigate('/favorite')}
                  />
            {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
            </nav>
            <div className="create-listing__container">
                <h2>Create New Listing</h2>
                <div className="create-listing__layout">
                <form onSubmit={handleSubmit} className="form">
                    {/* Title */}
                    <div className="form__section">
                        <label>Title <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </div>
                    {/* Price */}
                    <div className="form__section">
                        <label>Price <span className="required">*</span></label>
                        <input
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) => handleChange("price", e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="form__section">
                        <label>Description</label>
                        <textarea
                            placeholder="Describe your item"
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="form__section">
                        <label>Category <span className="required">*</span></label>
                        <select
                            value={form.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                        >
                            <option value="">Select category</option>
                            <option>Clothes</option>
                            <option>Text Books</option>
                            <option>Furniture</option>
                            <option>Electronics</option>
                            <option>School Supplies</option>
                            <option>Room Search</option>
                        </select>
                    </div>

                    {/* Tag */}
                    <div className="form__section">
                        <label>Tag</label>
                        <input
                            type="text"
                            placeholder="Add a tag (optional)"
                            value={form.tag}
                            onChange={(e) => handleChange("tag", e.target.value)}
                        />
                    </div>

                    {/* Image */}
                    <div className="form__section">
                        <label>Image</label>
                        <input 
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange} 
                        />
                    </div>

                    {/* Submit */}
                    <button type="submit" className="form__submit">
                        Post Listing
                    </button>

                </form>
            {/* Image Preview */}
            {form.images.length > 0 && (
                        <div className="image-preview-container">
                            {form.images.map((image,index) => (
                                <div className="image-preview">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview-${index}`} 
                                />

                                <button 
                                    type="button-image"
                                    onClick={() => {
                                        setForm(prev => ({ 
                                            ...prev, 
                                            images: prev.images.filter((_, i) => i !== index) 
                                        }))
                                    }}
                                >
                                x
                                </button>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </div>
    </div>
    )
}