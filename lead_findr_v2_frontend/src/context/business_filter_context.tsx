import { createContext, useContext, useState } from "react";

//  Add new filter fields here
export interface BusinessFilter {
    selection_type?: "scan" | "city";
    scan_id?: string;
    city_selection?: {
        city: string;
        state?: string;
        country?: string;
    };
    min_dpi?: number;
    max_dpi?: number;
    badges?: string[];
    category?: string;
    sort_by?: string;
    has_website?: boolean;
    is_secure?: boolean;
    view_mode?: "list" | "map";
    search?: string;
}

interface BusinessFilterContextType {
    filters: BusinessFilter;
    setFilters: (filters: BusinessFilter) => void;
    updateFilter: <K extends keyof BusinessFilter>(key: K, value: BusinessFilter[K]) => void;
    resetFilters: () => void;
}

const BusinessFilterContext = createContext<BusinessFilterContextType | undefined>(undefined);

export function BusinessFilterProvider({ children }: { children: React.ReactNode }) {
    const [filters, setFiltersState] = useState<BusinessFilter>({});

    const setFilters = (newFilters: BusinessFilter) => {
        setFiltersState({ ...newFilters });
    };

    const updateFilter = <K extends keyof BusinessFilter>(key: K, value: BusinessFilter[K]) => {
        setFiltersState((prev) => ({ ...prev, [key]: value }));
    };


    const resetFilters = () => {
        setFiltersState({});
    };

    return (
        <BusinessFilterContext.Provider
            value={{ filters, setFilters, updateFilter, resetFilters }}
        >
            {children}
        </BusinessFilterContext.Provider>
    );
}

export function useBusinessFilters() {
    const context = useContext(BusinessFilterContext);
    if (!context) {
        throw new Error("useBusinessFilters must be used within a BusinessFilterProvider");
    }
    return context;
}
