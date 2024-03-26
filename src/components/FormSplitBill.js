import { useState } from "react";
import { Button } from "./Button";

export function FormSplitBill({
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
