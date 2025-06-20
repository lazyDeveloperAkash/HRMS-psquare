import { useState } from "react"
import { Search, X } from "lucide-react"
import "./SearchBar.css"

const SearchBar = ({ placeholder = "Search...", onSearch, className = "", ...props }) => {
  const [searchValue, setSearchValue] = useState("")

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    setSearchValue("")
    if (onSearch) {
      onSearch("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchValue)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`search-bar ${className}`} {...props}>
      <div className="search-input-container">
        <Search className="search-icon" size={18} />
        <input
        style={{borderRadius: "9999px"}}
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
        />
        {searchValue && (
          <button type="button" onClick={handleClear} className="clear-button" aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar
