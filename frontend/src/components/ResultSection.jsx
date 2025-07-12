import { useState } from "react";
import ResultCard from "./ResultCard";
import { FiSearch } from "react-icons/fi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiOutlineChartBar } from "react-icons/hi";
import InsightsPanel from "./InsightsPanel";
import InsightsTab from "./InsightsTab";

const tabs = ["All", "Likely to Stay", "Likely to Leave"];

export default function ResultSection({ predictions }) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [showInsights, setShowInsights] = useState(false);

  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center text-purple-300 mt-10 text-lg italic">
        No predictions available. Upload a file to get started.
      </div>
    );
  }

  // Count summaries
  const total = predictions.length;
  const stayCount = predictions.filter(
    (p) => p.prediction === "Likely to stay"
  ).length;
  const leaveCount = predictions.filter(
    (p) => p.prediction === "Likely to leave"
  ).length;

  // Filter by active tab + search
  const filtered = predictions.filter((p) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Likely to Stay" && p.prediction === "Likely to stay") ||
      (activeTab === "Likely to Leave" && p.prediction === "Likely to leave");

    const matchesSearch = p.employeeName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 px-4">
      <h1 className="text-4xl text-purple-300 mb-6 font-semibold text-center tracking-wide flex items-center justify-center gap-3">
        <FiSearch className="text-purple-400 text-3xl" />
        Prediction Results
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 text-purple-200 border border-purple-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400"
          />
          <FiSearch className="absolute left-3 top-2.5 text-purple-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {tabs.map((tab) => {
          const count =
            tab === "All"
              ? total
              : tab === "Likely to Stay"
                ? stayCount
                : leaveCount;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm sm:text-base
                ${
                  activeTab === tab
                    ? "bg-purple-500 text-white border-purple-500 shadow-md"
                    : "bg-black/20 text-purple-300 border-purple-700 hover:bg-purple-600 hover:text-white"
                }`}
            >
              {tab}{" "}
              <span className="ml-2 text-xs bg-purple-800 px-2 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filtered.length > 0 ? (
          filtered.map((result, index) => (
            <ResultCard
              key={index}
              employeeName={result.employeeName || `Employee ${index + 1}`}
              prediction={result.prediction}
              probability={result.probability}
              // topFactors={result.topFeatures || result.topFactors}
              feedback={result.feedback}
            />
          ))
        ) : (
          <p className="text-purple-300 col-span-full mt-6 text-center italic">
            No matching employees found.
          </p>
        )}
      </div>
      <InsightsPanel
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
      >
        {/* Placeholder content for now */}
        <InsightsTab predictions={predictions}/>
      </InsightsPanel>
      <button
        onClick={() =>
          showInsights ? setShowInsights(false) : setShowInsights(true)
        }
        className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-5 rounded-full shadow-lg flex items-center gap-2 transition duration-300"
      >
        <HiOutlineChartBar className="text-xl" />
        View Insights
      </button>
    </div>
  );
}
