import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axios from "axios";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import Modal from "../../components/Modal";

const GET_ALL_API = "/api/v1/expense/get";
const ADD_API = "/api/v1/expense/add";
const DELETE_API = "/api/v1/expense";
const DOWNLOAD_EXCEL_API = "/api/v1/expense/downloadexcel";

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const getToken = () => localStorage.getItem("token");

  // Fetch all Expense Details
  const fetchExpenseDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(GET_ALL_API, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setExpenseData(res.data);
    } catch (err) {
      setError("Failed to load expenses");
    }
    setLoading(false);
  };

  // Add Expense using direct API from your backend
  const handleAddExpense = async (expense) => {
    const { name, amount, date, category, icon = "" } = expense;
    if (!name || !name.trim()) {
      alert("Expense Name is required."); return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Amount should be a valid number greater than 0."); return;
    }
    if (!date) { alert("Date is required."); return; }
    try {
      const res = await axios.post(ADD_API, {
        name, amount, date, category, icon, type: "expense"
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setExpenseData(prev => [...prev, res.data]);
      setOpenAddExpenseModal(false);
    } catch (err) {
      alert("Failed to add expense.");
    }
  };

  // Delete Expense using direct API from your backend
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${DELETE_API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setExpenseData(prev => prev.filter(e => e._id !== id));
      setOpenDeleteAlert({ show: false, data: null });
      setFeedbackMsg("Item deleted successfully!");
      setTimeout(() => setFeedbackMsg(""), 2000);
    } catch {
      alert("Failed to delete expense");
    }
  };

  // Download expense details as Excel
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axios.get(DOWNLOAD_EXCEL_API, {
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      alert("Failed to download expense details!");
    }
  };

  useEffect(() => { fetchExpenseDetails(); }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto max-w-3xl">
        <ExpenseOverview
          transactions={expenseData}
          onExpenseIncome={() => setOpenAddExpenseModal(true)}
        />
        {feedbackMsg && (
          <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded shadow text-center">
            {feedbackMsg}
          </div>
        )}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* PASS handleDownloadExpenseDetails TO ExpenseList */}
        <ExpenseList
          transactions={expenseData}
          onDelete={id => setOpenDeleteAlert({ show: true, data: id })}
          onDownload={handleDownloadExpenseDetails}
        />
        {openDeleteAlert.show && (
          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <div>
              <p>Are you sure you want to delete this expense?</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleDeleteExpense(openDeleteAlert.data)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                <button onClick={() => setOpenDeleteAlert({ show: false, data: null })} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

// Inline AddExpenseForm as subcomponent
const AddExpenseForm = ({ onAddExpense }) => {
  const [form, setForm] = useState({ name: "", amount: "", date: "", category: "", icon: "" });
  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const handleSubmit = e => { e.preventDefault(); onAddExpense(form); };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input name="name" placeholder="Expense Name" value={form.name} onChange={handleChange} required className="border p-2 rounded" />
      <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required className="border p-2 rounded" />
      <input name="date" type="date" value={form.date} onChange={handleChange} required className="border p-2 rounded" />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border p-2 rounded" />
      <input name="icon" placeholder="Icon (optional emoji)" value={form.icon} onChange={handleChange} className="border p-2 rounded" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Expense</button>
    </form>
  );
};

export default Expense;
