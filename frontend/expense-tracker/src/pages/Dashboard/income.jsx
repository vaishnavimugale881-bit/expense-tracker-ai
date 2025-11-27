import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import Modal from "../../components/Modal";
import IncomeList from "../../components/Income/IncomeList";
import { useUserAuth } from "../../hooks/useUserAuth";
import axios from "axios";

const GET_ALL_API_URL = "/api/v1/income/get";
const ADD_INCOME_API_URL = "/api/v1/income/add";
const DELETE_INCOME_API_URL = "/api/v1/income/delete";
const DOWNLOAD_INCOME_EXCEL_API = "/api/v1/income/downloadexcel"; // <-- Confirm this matches your backend

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  const fetchIncomeDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(GET_ALL_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setIncomeData(data);
    } catch (error) {
      console.error("Failed to fetch income data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    setLoading(true);
    try {
      const res = await fetch(ADD_INCOME_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify(income),
      });
      const result = await res.json();
      setIncomeData([...incomeData, result]);
      setOpenAddIncomeModal(false);
    } catch (error) {
      console.error("Failed to add income", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async () => {
    setLoading(true);
    try {
      const id = openDeleteAlert.data;
      await fetch(`${DELETE_INCOME_API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` },
      });
      setIncomeData(incomeData.filter(item => item._id !== id));
      setOpenDeleteAlert({ show: false, data: null });
    } catch (error) {
      console.error("Failed to delete income", error);
    } finally {
      setLoading(false);
    }
  };

  // Download Income Excel functionality
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axios.get(DOWNLOAD_INCOME_EXCEL_API, {
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details:", error.response || error);
      alert("Failed to download income details!");
    }
  };

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
            onDeleteIncome={(id) => setOpenDeleteAlert({ show: true, data: id })}
            loading={loading}
            onDownloadIncome={handleDownloadIncomeDetails}
          />
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = {
                source: e.target.source.value,
                amount: Number(e.target.amount.value),
                date: e.target.date.value,
              };
              await handleAddIncome(formData);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="source" className="block font-medium mb-1">
                Source
              </label>
              <input
                id="source"
                name="source"
                type="text"
                required
                className="w-full p-2 border rounded"
                placeholder="e.g. Salary, Freelance"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block font-medium mb-1">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                required
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label htmlFor="date" className="block font-medium mb-1">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="add-btn"
                onClick={() => setOpenAddIncomeModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-btn"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Income"}
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <div>
            <p>Are you sure you want to delete this income entry?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="add-btn"
                onClick={() => setOpenDeleteAlert({ show: false, data: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="add-btn"
                onClick={handleDeleteIncome}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
