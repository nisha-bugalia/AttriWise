// InsightsTab.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

const COLORS = ["#f87171", "#34d399"]; // red for leave, green for stay

export default function InsightsTab({ predictions }) {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-purple-300 text-center py-10 text-lg italic">
        No insights available. Upload employee data to generate predictions.
      </div>
    );
  }

  // Step 1: Count Likely to leave vs stay
  const pieData = [
    {
      name: "Likely to leave",
      value: predictions.filter((p) => p.prediction === "Likely to leave")
        .length,
    },
    {
      name: "Likely to stay",
      value: predictions.filter((p) => p.prediction === "Likely to stay")
        .length,
    },
  ];

  const leavingFeatures = predictions
    .filter((p) => p.prediction === "Likely to leave")
    .flatMap((p) => p.top_features || []);

  // Step 2: Count frequency
  const featureCounts = {};
  leavingFeatures.forEach((feature) => {
    featureCounts[feature] = (featureCounts[feature] || 0) + 1;
  });

  // Step 3: Convert to data array and sort
  const featureData = Object.entries(featureCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 features

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-purple-200 text-center mb-1">
          Attrition Prediction Overview
        </h2>
        <p className="text-center text-purple-400 mb-6">
          This chart shows the overall distribution of employees likely to leave
          or stay.
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={({ name, percent }) =>
              //   `${name} (${(percent * 100).toFixed(0)}%)`
              // }
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full max-w-4xl mx-auto px-2 mt-16">
        <h2 className="text-3xl font-semibold text-purple-200 text-center mb-1">
          Key Drivers of Attrition
        </h2>
        <p className="text-center text-purple-400 mb-6">
          These features were most commonly found among employees likely to
          leave.
        </p>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            layout="vertical"
            data={featureData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#f472b6">
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
