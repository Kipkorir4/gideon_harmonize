import React, { useState, useEffect } from 'react';
import './styles/Subscriptions.css'; // Ensure you have a Subscriptions.css for styling

function Subscriptions({ user }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveTable, setShowRemoveTable] = useState(false);
  const [subscriptionName, setSubscriptionName] = useState('');
  const [subscriptionAmount, setSubscriptionAmount] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`/api/subscriptions?userId=${user.id}`)
        .then(response => response.json())
        .then(data => setSubscriptions(data.subscriptions))
        .catch(error => console.error("Error fetching subscriptions:", error));
    }
  }, [user]);

  const handleAddSubscription = () => {
    fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        name: subscriptionName,
        amount: subscriptionAmount,
      }),
    })
      .then(response => response.json())
      .then(newSubscription => {
        setSubscriptions([...subscriptions, newSubscription]);
        setShowAddForm(false);
      })
      .catch(error => console.error("Error adding subscription:", error));
  };

  const handleRemoveSubscription = (subscriptionId) => {
    fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
      })
      .catch(error => console.error("Error removing subscription:", error));
  };

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-buttons">
        <button onClick={() => setShowAddForm(!showAddForm)}>Add Subscription</button>
        <button onClick={() => setShowRemoveTable(!showRemoveTable)}>Remove Subscription</button>
      </div>

      {showAddForm && (
        <div className="add-subscription-form">
          <h3>Add Subscription</h3>
          <input
            type="text"
            placeholder="Subscription Name"
            value={subscriptionName}
            onChange={(e) => setSubscriptionName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Subscription Amount"
            value={subscriptionAmount}
            onChange={(e) => setSubscriptionAmount(e.target.value)}
          />
          <button onClick={handleAddSubscription}>Submit</button>
        </div>
      )}

      {showRemoveTable && (
        <table className="remove-subscriptions-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td>{subscription.name}</td>
                <td>{subscription.amount}</td>
                <td>
                  <button
                    className="unsubscribe-button"
                    onClick={() => handleRemoveSubscription(subscription.id)}
                  >
                    Unsubscribe
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {subscriptions.length > 0 ? (
        <div className="subscriptions-list">
          <h3>Your Subscriptions</h3>
          <ul>
            {subscriptions.map((subscription) => (
              <li key={subscription.id}>
                {subscription.name}: {subscription.amount}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Your subscriptions will appear here once you subscribe to services</p>
      )}
    </div>
  );
}

export default Subscriptions;
