import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";

const categoryStyles = {
  food: {
    icon: <LuUtensils />,
    bg: "bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300",
    iconColor: "text-blue-600",
  },
  income: {
    icon: <LuTrendingUp />,
    bg: "bg-gradient-to-br from-green-200 via-green-100 to-green-300",
    iconColor: "text-green-600",
  },
  expense: {
    icon: <LuTrendingDown />,
    bg: "bg-gradient-to-br from-red-200 via-pink-100 to-red-300",
    iconColor: "text-red-600",
  },
  default: {
    icon: <LuUtensils />,
    bg: "bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300",
    iconColor: "text-slate-600",
  },
};

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
  category,
}) => {
  const styleSet =
    categoryStyles[category] || categoryStyles[type] || categoryStyles.default;

  // Defensive icon rendering, works for both JSX elements and missing icons
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        className: `text-2xl ${styleSet.iconColor}`,
      });
    }
    if (React.isValidElement(styleSet.icon)) {
      return React.cloneElement(styleSet.icon, {
        className: `text-2xl ${styleSet.iconColor}`,
      });
    }
    return <span className="text-xl">{title ? title[0] : "?"}</span>;
  };

  return (
    <div
      className={`flex items-center gap-4 p-5 rounded-xl bg-white shadow-lg border 
        ${type === "income" ? "border-green-100" : "border-red-100"} mb-3 hover:shadow-xl transition-shadow duration-200`}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${styleSet.bg} bg-opacity-80 mr-2`}
      >
        {renderIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-base truncate">{title}</span>
          <span
            className={`font-bold text-lg ${
              type === "income" ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{amount}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-400 text-xs">{date}</span>
          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-red-500 ml-2 transition"
              onClick={onDelete}
              title="Delete Transaction"
            >
              <LuTrash2 className="text-lg" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
