import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: 0,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 0,
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
  const [showAddfriend, setShowaddfriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedfriend, setSelectedfriend] = useState(null);
  function handleshowaddfriend() {
    setShowaddfriend((showAddfriend) => !showAddfriend);
  }

  function handleAddfriend(friend) {
    console.log("-----------", { friend });
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelection(friend) {
    // setSelectedfriend(friend);
    setSelectedfriend((currentSelect) =>
      currentSelect?.id === friend.id ? null : friend
    );
    setShowaddfriend(false);
  }
  function handleBillSplit(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedfriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <Friendslist
          friends={friends}
          onSelection={handleSelection}
          selectedfriend={selectedfriend}
        />

        {showAddfriend && <FormAddFriend onAddFriend={handleAddfriend} />}

        <Button onClick={handleshowaddfriend}>
          {showAddfriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedfriend && (
        <Formsplitbill
          selectedfriend={selectedfriend}
          onSplit={handleBillSplit}
        />
      )}
    </div>
  );
}

function Friendslist({ friends, onSelection, selectedfriend }) {
  //prop drilling

  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedfriend={selectedfriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedfriend }) {
  const isSelected = selectedfriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes You{Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are equal</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48?u=499476");

  function handleAddFriendSubmit(e) {
    e.preventDefault();

    if (!name || !img) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      img: `${img}=?${id}`,
      balance: 0,
      id,
    };
    console.log(newFriend);
    onAddFriend(newFriend);

    setImg("https://i.pravatar.cc/48?u=499476");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriendSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
      <Button onClick={handleAddFriendSubmit}>Add</Button>
    </form>
  );
}
function Formsplitbill({ selectedfriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [Paidbyuser, setPaidbyuser] = useState("");
  const [Whoispaying, setWhoispaying] = useState("user");
  const friendsexp = bill ? bill - Paidbyuser : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !Paidbyuser) return;
    onSplit(Whoispaying === "user" ? friendsexp : -Paidbyuser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedfriend.name}</h2>
      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your expense</label>
      <input
        type="text"
        value={Paidbyuser}
        onChange={(e) =>
          setPaidbyuser(
            Number(e.target.value) > bill ? Paidbyuser : Number(e.target.value)
          )
        }
      />
      <label>{selectedfriend.name}'s expense</label>
      <input type="text" disabled value={friendsexp} />
      <label>Who is paying the bill</label>
      <select
        value={Whoispaying}
        onChange={(e) => setWhoispaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
//
