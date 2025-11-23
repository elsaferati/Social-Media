import React from "react";

const notifications = [
  { id: 1, message: "Alice liked your post" },
  { id: 2, message: "Bob started following you" },
  { id: 3, message: "Charlie mentioned you in a comment" },
];

const NotificationItem = ({ message }) => (
  <div className="p-2 border-b">{message}</div>
);

const NotificationsPage = () => {
  return (
    <div className="notifications-page p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="border rounded">
        {notifications.map((n) => (
          <NotificationItem key={n.id} message={n.message} />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
