// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function AnimatedHeader() {
  return (
    <motion.div
      className="text-center text-6xl md:text-5xl lg:text-6xl font-extrabold text-purple-500 "
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      AttriWise
      <div className="mt-3 text-purple-200 text-xl font-semibold">
        Your AI-Powered Employee Attrition Assistant
      </div>
    </motion.div>
  );
}
