import { Friend } from "./Friend";

export function FriendList({
  friends,
  onSelection,
  selectedFriend,
  onRemoveFriend,
}) {
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
