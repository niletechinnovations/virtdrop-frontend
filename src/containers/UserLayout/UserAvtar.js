import React from 'react';
import "./UserAvtar.css";

const UserAvtar = (props) => {
  let name = localStorage.getItem( 'userName' );
  let arrName = name.split(" ");
  let firstName = arrName.slice(0, 1).join(' ');
  let lastName = arrName.slice(1, arrName.length).join(' ');
  return (
    <div className="profileImage">{firstName.substring(0, 1)+''+lastName.substring(0, 1)}</div>
  );
}

export default UserAvtar;
