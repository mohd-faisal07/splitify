import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { FriendList } from "./components/FriendList";
import { Heading } from "./components/Heading";
import { FormAddFriend } from "./components/FormAddFriend";
import { FormSplitBill } from "./components/FormSplitBill";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(function () {
    const storedValue = localStorage.getItem("local");
    return JSON.parse(storedValue) || [];
  });

  // const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, SetShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showSplitDialog, setShowSplitDialog] = useState(false);

  function handleShowAddFriend() {
    SetShowAddFriend((show) => !show);
    document.querySelector(".overlay").classList.toggle("hidden");
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    SetShowAddFriend(false);
    setShowSplitDialog(true);
    document.querySelector(".overlay").classList.add("hidden");
  }
  function handleRemoveFriend(id, name) {
    const remove = window.confirm(`Remove ${name}?`);
    if (remove) {
      setFriends((friends) => friends.filter((friend) => friend.id !== id));
    }
  }

  function handleDialogClose() {
    setSelectedFriend(null);
    setShowSplitDialog(false);
    document.querySelector(".overlay").classList.add("hidden");
  }
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    SetShowAddFriend(false);
    setShowSplitDialog(true);
    document.querySelector(".overlay").classList.remove("hidden");
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
    setShowSplitDialog(false);
    document.querySelector(".overlay").classList.add("hidden");
  }
  useEffect(
    function () {
      localStorage.setItem("local", JSON.stringify(friends));
    },
    [friends]
  );

  return (
    <div>
      <Heading />

      <div className="app">
        <div className="sidebar">
          <h2>Friend-List</h2>
          <FriendList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelection={handleSelection}
            onRemoveFriend={handleRemoveFriend}
          />
          {showAddFriend && (
            <FormAddFriend
              onAddFriend={handleAddFriend}
              handleShowAddFriend={handleShowAddFriend}
            />
          )}
          {!showAddFriend ? (
            <Button onClick={handleShowAddFriend}>Add friend</Button>
          ) : null}
        </div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplit={handleSplitBill}
            showSplitDialog={showSplitDialog}
            key={selectedFriend.id}
            closeDialog={handleDialogClose}
          />
        )}
      </div>
    </div>
  );
}
