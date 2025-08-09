// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { ChartSpline } from "lucide-react";

// const COLORS = ["#10b981", "#ef4444"];

// function PiChart({ income, expense }) {
//   const pieData = [
//     { name: "Income", value: income },
//     { name: "Expense", value: expense },
//   ];

//   const balance = income - expense;

//   return (
//     <div className="bg-card rounded-lg border shadow-sm p-4 h-[120px] flex flex-col justify-between">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-1">
//         <p className="text-sm font-medium text-muted-foreground">Analytics</p>
//         <ChartSpline className="h-4 w-4 text-muted-foreground" />
//       </div>

//       {/* Chart */}
//       <div className="flex-1 flex items-center justify-between">
//         <ResponsiveContainer width={245} >
//           <PieChart>
//             <Pie
//               data={pieData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={30}
//             >
//               {pieData.map((_, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>

//         {/* Balance Display */}
//         <div className="text-right ">
//           <p className="text-xs text-muted-foreground">Balance</p>
//           <p className="text-base font-semibold">${balance}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PiChart;

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartSpline } from "lucide-react";

const COLORS = ["#10b981", "#ef4444"];

function PiChart({ income, expense }) {
  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const balance = income - expense;

  return (
   <div className="bg-card rounded-lg border shadow-sm p-4 h-[120px] flex flex-col justify-between w-full max-w-full">
  {/* Header */}
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm font-medium text-muted-foreground">Analytics</p>
    <ChartSpline className="h-4 w-4 text-muted-foreground" />
  </div>

  {/* Content */}
  <div className="flex items-center justify-between gap-4 flex-1">
    {/* Pie Chart */}
    <div className="flex justify-center items-center w-1/2 h-full">
      <ResponsiveContainer width={80} height={80}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={30}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Balance */}
    <div className="text-center w-1/2">
      <p className="text-xs text-muted-foreground">Balance</p>
      <p className="text-base font-semibold">${balance}</p>
    </div>
  </div>
</div>

  );
}

export default PiChart;

