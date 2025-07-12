// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function ResultCard({
  employeeName,
  prediction,
  probability,
  // topFactors,
  feedback,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-black/30 border border-purple-500 rounded-xl p-6 shadow-lg w-full max-w-[700px] text-purple-200"
    >
      <h2 className="text-xl font-bold text-purple-400 mb-2">{employeeName}</h2>
      <p className="text-base mb-2">
        <span className="font-semibold">Prediction:</span> {prediction}
      </p>
      <div className="mt-2">
        <p className="text-base text-purple-300 mb-1">Prediction Confidence:</p>
        <div className="w-full bg-purple-900 rounded-full h-3">
          <div
            className="bg-purple-400 h-3 rounded-full transition-all"
            style={{ width: `${(probability * 100).toFixed(1)}%` }}
          ></div>
        </div>
        <p className="text-sm text-purple-200 mt-1">
          {(probability * 100).toFixed(1)}%
        </p>
      </div>

      {/* <p className="text-base mb-2">
        <span className="font-semibold">Top Influencing Factors:</span>{" "}
        {Array.isArray(topFactors) ? topFactors.join(", ") : "N/A"}
      </p> */}

      <p className="text-base italic text-purple-300 mt-3">{feedback}</p>
    </motion.div>
  );
}
