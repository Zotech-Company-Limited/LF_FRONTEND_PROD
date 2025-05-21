import { useRouter } from "next/navigation";

interface BusinessListProps {
    businesses: Array<{
        place_id: string;
        name: string;
        city: string;
        dpi_score: number;
        dpi_badge: string;
        website_score: number;
        social_score: number;
        backlink_score: number;
        brand_score: number;
        address: string;
    }>;
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function BusinessList({
    businesses,
    total,
    page,
    pageSize,
    onPageChange,
}: BusinessListProps) {
    const totalPages = Math.ceil(total / pageSize);
    const router = useRouter();

    if (businesses.length === 0)
        return <div className="business-empty">No businesses found.</div>;

    return (
        <div className="">
            <div className="mb-4">
                <h2 className="text-sm text-gray-700">
                    Showing <strong>{businesses.length}</strong> business
                    {businesses.length !== 1 && "es"} (Page {page} of {totalPages})
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="business-table w-full border-collapse text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th>Name</th>
                            <th>City</th>
                            <th>DPI Score</th>
                            <th>Badge</th>
                            <th>Website</th>
                            <th>Social</th>
                            <th>Backlink</th>
                            <th>Brand</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {businesses.map((b) => (
                            <tr
                                key={b.place_id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => router.push(`/business/${b.place_id}`)}
                            >
                                <td>{b.name}</td>
                                <td>{b.city}</td>
                                <td>{b.dpi_score}%</td>
                                <td>{b.dpi_badge}</td>
                                <td>{b.website_score}%</td>
                                <td>{b.social_score}%</td>
                                <td>{b.backlink_score}%</td>
                                <td>{b.brand_score}%</td>
                                <td>{b.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls mt-4 flex justify-between items-center text-sm">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    ⬅ Prev
                </button>
                <span className="text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next ➡
                </button>
            </div>
        </div>
    );
}