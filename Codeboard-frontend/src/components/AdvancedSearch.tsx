/**
 * AdvancedSearch Component
 *
 * A comprehensive search component with filters for:
 * - Real-time search as you type
 * - Tag-based filtering
 * - Date range filtering
 * - Multiple sorting options
 * - Expandable filter panel
 * - Search history
 */

import React, { useState, useEffect, useRef } from "react";
// Material UI icons
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// API service
import { getTags } from "../services/codeboardApi";
// UI components
import TextField from "./ui/TextField";
import Button from "./ui/Button";
import Tag from "./ui/Tag";

interface SearchFilters {
  query: string;
  tags: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: "recent" | "title" | "created" | "updated";
  sortOrder: "asc" | "desc";
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  placeholder?: string;
}
const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  initialFilters = {},
  placeholder = "Search notes by title, content, or tags...",
}) => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    tags: [],
    dateRange: { start: "", end: "" },
    sortBy: "recent",
    sortOrder: "desc",
    ...initialFilters,
  });

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // References
  const searchRef = useRef<HTMLInputElement>(null);

  // Load available tags and search history on component mount
  useEffect(() => {
    // Load available tags from API
    getTags()
      .then(setAvailableTags)
      .catch(() => console.error("Failed to load tags"));

    // Load search history from localStorage
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Debounce search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  // Filter update helper
  const updateFilters = (updates: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Handle search query change and update history
  const handleQueryChange = (query: string) => {
    updateFilters({ query });

    // Add to search history if not empty and not already present
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory.slice(0, 9)]; // Keep last 10
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  };

  // Toggle a tag in the filters
  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      query: "",
      tags: [],
      dateRange: { start: "", end: "" },
      sortBy: "recent",
      sortOrder: "desc",
    });
  };

  // Get human-readable tag display name
  const getTagDisplay = (tag: string) => {
    const tagMap: { [key: string]: string } = {
      DATABASE: "Database",
      ALGORITHM: "Algorithm",
      FRONTEND: "Frontend",
      BACKEND: "Backend",
      DIY: "DIY",
      NOTES: "Notes",
      GAMES: "Games",
      COMPONENTS: "Components",
      TUTORIAL: "Tutorial",
      SNIPPET: "Snippet",
      MOBILE: "Mobile",
      WEB: "Web",
      API: "API",
      TOOLS: "Tools",
      CONFIG: "Config",
      EXPERIMENTAL: "Experimental",
      ARCHIVE: "Archive",
      OTHER: "Other",
    };
    return tagMap[tag] || tag;
  };

  // Map tag name to color for better visual distinction
  const getTagColor = (
    tag: string
  ):
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "neutral" => {
    const colorMap: { [key: string]: any } = {
      DATABASE: "info",
      ALGORITHM: "primary",
      FRONTEND: "secondary",
      BACKEND: "primary",
      DIY: "warning",
      NOTES: "neutral",
      GAMES: "error",
      COMPONENTS: "secondary",
      TUTORIAL: "success",
      SNIPPET: "info",
      MOBILE: "warning",
      WEB: "secondary",
      API: "primary",
      TOOLS: "neutral",
      CONFIG: "info",
      EXPERIMENTAL: "warning",
      ARCHIVE: "neutral",
      OTHER: "neutral",
    };
    return colorMap[tag] || "neutral";
  };

  return (
    <div className="advanced-search">
      {/* Main Search Bar */}
      <div className="search-bar">
        <TextField
          type="search"
          placeholder={placeholder}
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setShowHistory(searchHistory.length > 0)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          startIcon={<SearchIcon />}
          endIcon={
            filters.query ? (
              <Button
                variant="light"
                appearance="text"
                size="xs"
                onClick={() => handleQueryChange("")}
                ariaLabel="Clear search"
                icon={<ClearIcon />}
              >
                Clear
              </Button>
            ) : null
          }
          fullWidth
          inputRef={searchRef}
        />

        <Button
          variant={showFilters ? "primary" : "light"}
          appearance={showFilters ? "solid" : "ghost"}
          size="sm"
          icon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          ariaLabel={showFilters ? "Hide filters" : "Show filters"}
        >
          Filter
        </Button>

        {/* Search History Dropdown */}
        {showHistory && (
          <div className="search-history">
            {searchHistory.map((historyItem, index) => (
              <button
                key={index}
                className="history-item"
                onClick={() => {
                  handleQueryChange(historyItem);
                  setShowHistory(false);
                }}
              >
                {historyItem}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3 className="filters-title">
              <FilterListIcon fontSize="small" />
              Advanced Filters
            </h3>
            <Button
              variant="light"
              appearance="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>

          {/* Tags Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <LocalOfferIcon fontSize="small" />
              Filter by Tags:
            </label>

            <div className="tags-container">
              {availableTags.map((tag) => (
                <Tag
                  key={tag}
                  label={getTagDisplay(tag)}
                  color={getTagColor(tag)}
                  variant={filters.tags.includes(tag) ? "filled" : "soft"}
                  size="small"
                  onClick={() => handleTagToggle(tag)}
                  active={filters.tags.includes(tag)}
                />
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <CalendarTodayIcon fontSize="small" />
              Date Range:
            </label>

            <div className="date-range">
              <div className="date-input">
                <label className="date-label">From:</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    updateFilters({
                      dateRange: {
                        ...filters.dateRange,
                        start: e.target.value,
                      },
                    })
                  }
                  className="date-field"
                />
              </div>

              <div className="date-input">
                <label className="date-label">To:</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    updateFilters({
                      dateRange: { ...filters.dateRange, end: e.target.value },
                    })
                  }
                  className="date-field"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <label className="filter-label">Sort by:</label>

            <div className="sort-options">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  updateFilters({ sortBy: e.target.value as any })
                }
                className="sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Title</option>
                <option value="created">Date Created</option>
                <option value="updated">Last Updated</option>
              </select>

              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  updateFilters({ sortOrder: e.target.value as any })
                }
                className="sort-select"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.tags.length > 0 ||
        filters.dateRange.start ||
        filters.dateRange.end) && (
        <div className="active-filters">
          <span className="filter-label-small">Active filters:</span>

          {filters.tags.map((tag) => (
            <Tag
              key={tag}
              label={getTagDisplay(tag)}
              color={getTagColor(tag)}
              size="small"
              variant="filled"
              onDelete={() => handleTagToggle(tag)}
            />
          ))}

          {filters.dateRange.start && (
            <Tag
              label={`From: ${filters.dateRange.start}`}
              color="primary"
              size="small"
              variant="filled"
              onDelete={() =>
                updateFilters({
                  dateRange: { ...filters.dateRange, start: "" },
                })
              }
            />
          )}

          {filters.dateRange.end && (
            <Tag
              label={`To: ${filters.dateRange.end}`}
              color="primary"
              size="small"
              variant="filled"
              onDelete={() =>
                updateFilters({
                  dateRange: { ...filters.dateRange, end: "" },
                })
              }
            />
          )}
        </div>
      )}

      {/* Component styles */}
      <style>{`
        .advanced-search {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
          position: relative;
        }

        .search-history {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--colors-background-card);
          border: 1px solid var(--colors-border-light);
          border-radius: var(--radii-lg);
          box-shadow: var(--shadows-md);
          z-index: 1000;
          margin-top: 4px;
          overflow: hidden;
        }

        .history-item {
          display: block;
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: var(--font-sizes-sm);
          color: var(--colors-text-primary);
          transition: background-color var(--transitions-base);
        }

        .history-item:hover {
          background-color: var(--colors-background-secondary);
        }

        .filters-panel {
          background: var(--colors-background-card);
          border: 1px solid var(--colors-border-light);
          border-radius: var(--radii-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-md);
          box-shadow: var(--shadows-sm);
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-lg);
        }

        .filters-title {
          margin: 0;
          color: var(--colors-brand-primary);
          font-size: var(--font-sizes-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .filter-section {
          margin-bottom: var(--spacing-lg);
        }

        .filter-label {
          display: flex;
          margin-bottom: var(--spacing-xs);
          font-weight: 600;
          color: var(--colors-brand-primary);
          font-size: var(--font-sizes-sm);
          align-items: center;
          gap: var(--spacing-xs);
        }

        .filter-label-small {
          font-size: var(--font-sizes-xs);
          color: var(--colors-text-tertiary);
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }

        .date-range {
          display: flex;
          gap: var(--spacing-md);
          align-items: center;
        }

        .date-input {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xxs);
        }

        .date-label {
          font-size: var(--font-sizes-xs);
          color: var(--colors-text-tertiary);
        }

        .date-field {
          padding: var(--spacing-xs) var(--spacing-sm);
          border: 1px solid var(--colors-border-light);
          border-radius: var(--radii-md);
          font-size: var(--font-sizes-sm);
          color: var(--colors-text-primary);
        }

        .sort-options {
          display: flex;
          gap: var(--spacing-md);
        }

        .sort-select {
          padding: var(--spacing-xs) var(--spacing-sm);
          border: 1px solid var(--colors-border-light);
          border-radius: var(--radii-md);
          font-size: var(--font-sizes-sm);
          background: var(--colors-background-card);
          color: var(--colors-text-primary);
        }

        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm);
          background: var(--colors-background-secondary);
          border-radius: var(--radii-md);
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default AdvancedSearch;
