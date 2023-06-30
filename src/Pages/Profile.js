import React from "react";

// all the private info. Lock it with a lock!

export default function Profile(props) {
  const { currUser } = props;
  console.log(`currUser:`, currUser);

  return (
    <div>
      <h1>Profile Page!</h1>
      <p>Hello, {currUser}</p>
    </div>
  );
}
