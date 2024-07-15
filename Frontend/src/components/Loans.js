import React, { useState, useEffect } from 'react';

function Loans({ user }) {
  const [loans, setLoans] = useState([]);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/loans?userId=${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setLoans(data.loans);
          setCurrentLoan(data.currentLoan);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching loans:", error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Please log in to view your loans.</p>;
  }

  if (!currentLoan && loans.length === 0) {
    return <p>You haven't borrowed a loan. When you do, you'll be able to view it here.</p>;
  }

  return (
    <div>
      <h1>My Loans</h1>
      {currentLoan && (
        <div className="loan-card">
          <h2>Current outstanding loan:</h2>
          <p>Amount: {currentLoan.amount}</p>
          <p>Date borrowed: {currentLoan.dateBorrowed}</p>
          <p>Interest rate: {currentLoan.interestRate}</p>
          <p>Trustee: {currentLoan.trustee}</p>
          <p>Target date: {currentLoan.targetDate}</p>
        </div>
      )}
      <h2>Loan History</h2>
      {loans.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date Borrowed</th>
              <th>Date Repaid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.amount}</td>
                <td>{loan.dateBorrowed}</td>
                <td>{loan.dateRepaid || 'Not repaid'}</td>
                <td>{loan.dateRepaid ? 'Repaid' : 'Outstanding'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no previous loans.</p>
      )}
    </div>
  );
}

export default Loans;
