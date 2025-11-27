import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu'; // Or any right arrow icon from react-icons

const RecentIncome = ({ transactions }) => {
  const navigate = useNavigate();

  // Inline button component
  const SeeAllButton = ({ onClick, label = 'See All' }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 font-semibold hover:bg-blue-100 transition focus:outline-none"
    >
      {label}
      <LuArrowRight />
    </button>
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-lg">Recent Income</h5>
        <SeeAllButton onClick={() => navigate('/income')} />
      </div>
      {Array.isArray(transactions) && transactions.length === 0 ? (
        <div className="text-gray-500 text-center mt-4">
          No transactions found.
        </div>
      ) : (
        <ul>
          {transactions.slice(0, 5).map((item) => (
            <li key={item._id} className="flex justify-between py-1 px-2">
              <span>{item.category || item.source}</span>
              <span>{item.amount}</span>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentIncome;
