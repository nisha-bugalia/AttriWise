// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";

export default function InsightsPanel({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-gray-900 z-50 p-6 overflow-y-auto shadow-xl border-l border-purple-500"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-purple-300 font-semibold">Insights</h2>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-200">
            <HiX className="text-2xl" />
          </button>
        </div>
        {children}
      </motion.div>
    </>
  );
}
