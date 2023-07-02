import React from "react";

// all the private info. Lock it with a lock!

// J: currently the profile page is not rendering out age, name, height, weight & gender.

export default function Profile(props) {
  const { name, email, height, weight, gender, age } = props;
  // J: i didn't pass password as props here - not sure if we should.

  return (
    <div>
      <h1>Profile Page!</h1>
      {/* J: added the following for testing purposes */}
      <p>Hello, {name}</p>
      <p>Email: {email}</p>
      <p>Age: {age}</p>
      <p>Height: {height}</p>
      <p>Weight: {weight}</p>
      <p>Gender: {gender}</p>
    </div>
  );
}
