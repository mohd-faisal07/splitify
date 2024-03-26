import { Button } from "./Button";

export function Friend({
  friend,
  onSelection,
  selectedFriend,
  onRemoveFriend,
}) {
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
