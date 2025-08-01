import { SUBSCRIBER } from '@/utils/apis';
import React, { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 10;

const NewsLetter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [domainFilter, setDomainFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch(SUBSCRIBER.GET_ALL);
        const data = await res.json();
        setSubscribers(data);
        setFilteredSubscribers(data);
      } catch (err) {
        setError("Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = subscribers.filter((sub) => {
      const emailMatch =
        domainFilter === "" || sub.email.toLowerCase().includes(domainFilter.toLowerCase());
      const date = new Date(sub.subscribedAt);
      const fromMatch = fromDate === "" || date >= new Date(fromDate);
      const toMatch = toDate === "" || date <= new Date(toDate);
      return emailMatch && fromMatch && toMatch;
    });
    setFilteredSubscribers(filtered);
    setCurrentPage(1); // reset to page 1 on filter change
  }, [domainFilter, fromDate, toDate, subscribers]);

  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Newsletter Subscribers</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by domain (e.g. @gmail.com)"
          className="border p-2 rounded w-full sm:w-auto"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded w-full sm:w-auto"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded w-full sm:w-auto"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubscribers.length === 0 ? (
                <tr>
                  <td className="p-4 text-gray-500" colSpan="2">No subscribers found.</td>
                </tr>
              ) : (
                paginatedSubscribers.map((sub, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{sub.email}</td>
                    <td className="p-4 border-b">
                      {new Date(sub.subscribedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsLetter;
