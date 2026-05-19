import { useState, useEffect} from "react"
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
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const { handleAccountClick } = useAccountNavigation({ isSignedIn, setLoginModalOpen })
    
    const MAX_IMAGES = 9

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        try {
            const res = await fetch('/api/categories', {
                credentials: 'include'
            })

            if (!res.ok) {
                throw new Error(`Server error (${res.status})`)
            }

            const data = await res.json()

            setCategories(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.title || !form.price || !form.category) {
            alert('Please fill in all required fields')
            return
        }

        if (form.images.length === 0) {
        alert('Please upload at least one image')
        return
    }

        try {
            const formData = new FormData()

            formData.append('title', form.title)
            formData.append('price', form.price)
            formData.append('description', form.description)
            formData.append('category', form.category)
            formData.append('tag', form.tag)

            form.images.forEach(image => {
                formData.append('images', image)
            })

            const res = await fetch('/api/items', {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || `Server error (${res.status})`)
            }

            const data = await res.json()

            navigate(`/items/${data.listingId}`)
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
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
                    onFavoritesClick={() => navigate('/favorites')}
                  />
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

                                {categories.map(category => (
                                    <option
                                        key={category.category_id}
                                        value={category.category_id}
                                    >
                                        {category.category_name}
                                    </option>
                                ))}
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
                            <label>Image <span className="required">*</span></label>
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
                    {form.images.length > 0 && (
                        <div className="image-preview-container">
                            {form.images.map((image, index) => (
                                <div className="image-preview" key={index}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview-${index}`}
                                    />

                                    <button
                                        type="button"
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
            {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
        </div>
    )
}