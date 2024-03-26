import { useState } from "react";
import { Button } from "./Button";

export function FormAddFriend({ onAddFriend, handleShowAddFriend }) {
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
