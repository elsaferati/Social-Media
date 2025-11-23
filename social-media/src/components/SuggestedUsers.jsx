import React from "react";

const SuggestedUsers = ({ users }) => {
  return (
    <div className="suggested-users p-4 border rounded mb-4">
      <h3 className="font-bold mb-2">Suggested Users</h3>
      {users.map((user) => (
        <div key={user.id} className="flex justify-between items-center mb-2">
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.username}</p>
          </div>
          <button className="bg-blue-500 text-white px-2 py-1 rounded">Follow</button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
