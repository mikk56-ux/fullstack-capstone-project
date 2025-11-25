import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
 const [updatedDetails, setUpdatedDetails] = useState({});
 const {setUserName} = useAppContext();
 const [changed, setChanged] = useState("");

 const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      const name=sessionStorage.getItem('name');
      if (name || authtoken) {
                const storedUserDetails = {
                  name: name,
                  email:email
                };

                setUserDetails(storedUserDetails);
                setUpdatedDetails(storedUserDetails);
              }
} catch (error) {
  console.error(error);
  // Handle error case
}
};

const handleEdit = () => {
setEditMode(true);
};

const handleInputChange = (e) => {
setUpdatedDetails({
  ...updatedDetails,
  [e.target.name]: e.target.value,
});
};
const handleSubmit = async (e) => {
  e.preventDefault(); // prevent default form submission

  try {
    // Get auth token and email from sessionStorage
    const authtoken = sessionStorage.getItem("auth-token");
    const email = sessionStorage.getItem("email");

    // Create payload with updated details
    const payload = {
      name: updatedDetails.name, // sending the updated name
    };

    const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${authtoken}`,
        "Content-Type": "application/json",
        "Email": email,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedUser = await response.json();

      // Update AppContext and sessionStorage
      setUserName(updatedUser.name);
      sessionStorage.setItem("name", updatedUser.name);

      setUserDetails(updatedUser);
      setEditMode(false);

      // Display success message
      setChanged("Name Changed Successfully!");
      setTimeout(() => {
        setChanged("");
        navigate("/"); // or navigate to profile page
      }, 1000);
    } else {
      throw new Error("Failed to update profile");
    }
  } catch (e) {
    console.log("Error updating details: " + e.message);
  }
};


return (
<div className="profile-container">
  {editMode ? (
<form onSubmit={handleSubmit}>
<label>
  Email
  <input
    type="email"
    name="email"
    value={userDetails.email}
    disabled // Disable the email field
  />
</label>
<label>
   Name
   <input
     type="text"
     name="name"
     value={updatedDetails.name}
     onChange={handleInputChange}
   />
</label>

<button type="submit">Save</button>
</form>
) : (
<div className="profile-details">
<h1>Hi, {userDetails.name}</h1>
<p> <b>Email:</b> {userDetails.email}</p>
<button onClick={handleEdit}>Edit</button>
<span style={{color:'green',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{changed}</span>
</div>
)}
</div>
);
};

export default Profile;