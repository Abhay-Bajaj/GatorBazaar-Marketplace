import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationSearchBar from "./components/NavigationSearchBar"
import LoginModal from "./components/LoginModal"

export default function CreateListing() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        category: "",
        tag: "",
        image: null,
    })
    const [query, setQuery] = useState("")
    const [loginModalOpen, setLoginModalOpen] = useState(false)

    function handleSearch(e) {
        e.preventDefault()
        navigate(`/search?q=${query}`)
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setForm(prev => ({ ...prev, image: file }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // basic validation
        if (!form.title || !form.price) {
            alert("Title and price are required")
            return
        }

        console.log("Submitting:", form)

        // TODO: send to backend

        navigate("/") // go back home after posting
    }


    return (
        <div className="create-listing">
            <nav className="nav-bar">
            <NavigationSearchBar
                    query={query}
                    onQueryChange={setQuery}
                    onSearch={handleSearch}
                    onProfileClick={() => setLoginModalOpen(true)}
                    onSellClick={() => navigate('/create-listing')}
                  />
            {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
            </nav>
            <div className="create-listing__container">
                <h2>Create New Listing</h2>

                <form onSubmit={handleSubmit} className="form">
                    {/* Title */}
                    <div className="form__section">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </div>
                    {/* Price */}
                    <div className="form__section">
                        <label>Price</label>
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
                        <label>Category</label>
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
                        <input type="file" onChange={handleImageChange} />
                    </div>

                    {/* Submit */}
                    <button type="submit" className="form__submit">
                        Post Listing
                    </button>

                </form>
            </div>
        </div>
    )
}