import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard"; // Make sure this is implemented
import moment from "moment";

const ExpenseList = ({ transactions = [], onDelete, onDownload }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">All Expenses</h3>
      <button className="card-btn" onClick={onDownload}>
        <LuDownload className="text-base" />
        Download
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {transactions.map(expense => (
        <TransactionInfoCard
          key={expense._id}
          title={expense.category}
          icon={expense.icon}
          date={moment(expense.date).format("Do MMM YYYY")}
          amount={expense.amount}
          type={expense.type}
          onDelete={() => onDelete(expense._id)}
        />
      ))}
    </div>
  </div>
);

export default ExpenseList;
