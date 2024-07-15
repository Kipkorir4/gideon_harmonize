import React, { useState, useEffect } from 'react';
import './styles/Savings.css'; // Ensure you have a Savings.css for styling

function Savings({ user }) {
  const [savingsActivities, setSavingsActivities] = useState([]);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mobile_money');
  const [disableWithdraw, setDisableWithdraw] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/savings?userId=${user.id}`)
        .then(response => response.json())
        .then(data => {
          setSavingsActivities(data.activities);
          setDisableWithdraw(data.activities.length === 0);
        })
        .catch(error => console.error("Error fetching savings activities:", error));
    }
  }, [user]);

  const handleTopUpSavings = () => {
    fetch('/api/savings/topup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        amount,
        method,
      }),
    })
      .then(response => response.json())
      .then(newActivity => {
        setSavingsActivities([...savingsActivities, newActivity]);
        setShowTopUpForm(false);
        setDisableWithdraw(false);
      })
      .catch(error => console.error("Error topping up savings:", error));
  };

  const handleWithdrawSavings = () => {
    fetch('/api/savings/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        amount,
      }),
    })
      .then(response => response.json())
      .then(newActivity => {
        setSavingsActivities([...savingsActivities, newActivity]);
        setShowWithdrawForm(false);
      })
      .catch(error => console.error("Error withdrawing savings:", error));
  };

  return (
    <div className="savings-container">
      <div className="savings-buttons">
        <button onClick={() => setShowTopUpForm(!showTopUpForm)}>Top up Savings</button>
        <button onClick={() => setShowWithdrawForm(!showWithdrawForm)} disabled={disableWithdraw}>
          Withdraw Savings
        </button>
      </div>

      {showTopUpForm && (
        <div className="topup-savings-form">
          <h3>Top up Savings</h3>
          <input
            type="number"
            placeholder="Amount to Top Up"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="mobile_money">Mobile Money</option>
            <option value="direct_deposit">Direct Deposit</option>
          </select>
          <button onClick={handleTopUpSavings}>Submit</button>
        </div>
      )}

      {showWithdrawForm && (
        <div className="withdraw-savings-form">
          <h3>Withdraw Savings</h3>
          <input
            type="number"
            placeholder="Amount to Withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleWithdrawSavings}>Submit</button>
        </div>
      )}

      {savingsActivities.length > 0 ? (
        <table className="savings-activities-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {savingsActivities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.type}</td>
                <td>{activity.amount}</td>
                <td>{new Date(activity.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Your activity on your savings will appear here once you do an activity</p>
      )}
    </div>
  );
}

export default Savings;
