
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../cards/TransactionInfoCard";

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Transactions</h5>
        <button className="card-btn" onClick={onSeeMore}>
          ee All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        {transactions?.slice(0, 5).map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.type === "expense" ? item.category : item.source}
            icon={item.icon} // icon should be JSX element (e.g., <LuUtensils />)
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
