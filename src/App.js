import { useEffect, useState } from "react";

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
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
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

function FriendList({ friends, onSelection, selectedFriend, onRemoveFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          onRemoveFriend={onRemoveFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend, onRemoveFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      {/* <img src={friend.image} alt={friend.id} /> */}
      <div>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            {" "}
            you owe {friend.name} ₹{Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance > 0 && (
          <p className="green">
            {" "}
            {friend.name} owes you ₹{Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p> you and {friend.name} are even</p>}
      </div>
      {/* <div className=""> */}
      <button
        className="btn-delete dialogCloseBtn listActionButtons"
        onClick={() => onRemoveFriend(friend.id, friend.name)}
      >
        Delete
      </button>
      <Button onClick={() => onSelection(friend)}>Select</Button>
      {/* </div> */}
    </li>
  );
}
function Heading() {
  return (
    <div className="headingContainer">
      <h1 className="heading">Splitify</h1>
      <p>Split bills with ease</p>
    </div>
  );
}

function FormAddFriend({ onAddFriend, handleShowAddFriend }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const id = new Date().getTime();

    if (!name) return;

    const newFriend = {
      name,
      id,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
  }

  return (
    <dialog open className="DialogAddFriend">
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label> 🤼 Friend name </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleShowAddFriend} className="button dialogCloseBtn">
          Close
        </button>
        <Button>Add</Button>
      </form>
    </dialog>
  );
}
function FormSplitBill({
  selectedFriend,
  onSplit,
  showSplitDialog,
  closeDialog,
}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplit(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <dialog open={showSplitDialog} className="open-dialog">
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2> Split bill with {selectedFriend.name}</h2>
        <label> 💸 Enter total bill amount</label>
        <input
          type="number"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />
        <label> 💲 your expense</label>
        <input
          type="number"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByUser
                : Number(e.target.value)
            )
          }
        />
        <label> 👬 {selectedFriend.name}'s expense</label>
        <input type="number" disabled value={paidByFriend} />
        <label> 🤑 whos paying the bill</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">you</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
        <button className="button dialogCloseBtn" onClick={closeDialog}>
          Close
        </button>
        <Button>Split bill</Button>
      </form>
    </dialog>
  );
}
