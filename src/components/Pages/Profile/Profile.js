import React, { useEffect, useState } from "react";
import { useAuth } from "../Store/UseContext";
import styled from "styled-components";

const Profile = () => {
  const { getRegisteredUser, usertype } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const users = getRegisteredUser();
    // Find the current logged-in user (assuming you're identifying by email or some other unique property)
    const currentUser = users.find(user => user.usertype.toLowerCase() === usertype);
    setUserData(currentUser);
  }, [usertype, getRegisteredUser]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileImage src="assets/img/profile-img.jpg" alt="Profile" />
          <ProfileTitle>{userData.name}</ProfileTitle>
        </ProfileHeader>
        <ProfileInfo>
          <InfoItem>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{userData.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>User Type:</InfoLabel>
            <InfoValue>{userData.usertype}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Mobile Number:</InfoLabel>
            <InfoValue>{userData.phone}</InfoValue>
          </InfoItem>
        </ProfileInfo>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;

// Styled Components for styling the Profile page

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #f4f6f9;
 
  /* Media query for mobile screens */
  @media (max-width: 768px) {
    margin-left: 0; /* No left margin for mobile */
  }

  /* Media query for smaller laptops/tablets if needed */
  @media (min-width: 769px) {
    margin-left: 240px; 
    margin-bottom: 150px;
  }
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 500px;  // Increased width for a larger container
  padding: 30px; // Increased padding for more space
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 120px;  // Slightly larger image
  height: 120px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileTitle = styled.h2`
  font-size: 26px;  // Increased font size
  color: #333;
  font-weight: bold;  // Bolder title text
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 15px;  // Increased margin for spacing
  justify-content: space-between;
`;

const InfoLabel = styled.span`
  font-weight: bold;  // Bold font for labels
  color: #555;
`;

const InfoValue = styled.span`
  font-weight: bold;  // Bold font for values
  color: #777;
`;
