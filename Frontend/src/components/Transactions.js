import React, { useState, useEffect } from 'react';
import './styles/Transactions.css'; // Ensure you have a Transactions.css for styling

function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [mostRecentTransaction, setMostRecentTransaction] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/transactions?userId=${user.id}`)
        .then(response => response.json())
        .then(data => {
          setTransactions(data.transactions);
          setMostRecentTransaction(data.mostRecentTransaction);
        })
        .catch(error => console.error("Error fetching transactions:", error));
    }
  }, [user]);

  const handleWithdraw = () => {
    // Logic for withdraw
  };

  const handleDeposit = () => {
    // Logic for deposit
  };

  return (
    <div className="transactions-container">
      <div className="transactions-buttons">
        <button onClick={handleWithdraw}>Withdraw</button>
        <button onClick={handleDeposit}>Deposit</button>
      </div>
      
      {mostRecentTransaction ? (
        <div className="most-recent-transaction card">
          <h3>Most Recent Transaction</h3>
          <p>Type: {mostRecentTransaction.type}</p>
          <p>Amount: {mostRecentTransaction.amount}</p>
          <p>Date: {new Date(mostRecentTransaction.date).toLocaleString()}</p>
        </div>
      ) : (
        <p>Your Transactions will appear here once you begin transacting.</p>
      )}

      {transactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 15).map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>{new Date(transaction.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default Transactions;
