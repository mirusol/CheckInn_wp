CheckInn - Web Application Project

team members: Bilciurescu Elena - Alina
              Solomon Miruna - Maria
              Toma Daria - Maria
              
Welcome to the CheckInn project! This application will allow users to check in to various accommodations, manage bookings, and interact with admins to handle reservations and available resources.

Overview
CheckInn is a web-based application that allows both clients and admins to interact with accommodation services. Clients can register, log in, check availability, book rooms, and view their reservation history. Admins can manage user accounts, view all bookings, and update room availability. The platform also features file uploads (e.g., image uploads for room listings) and secure user authentication using Spring Security.

Features
Below are the key user stories for the CheckInn project, describing the major features:

User Story 1: User Registration and Login
As a new user,
I want to register an account on the platform,
so that I can log in and manage my bookings.

Acceptance Criteria:
The user can register with basic information (name, email, password).
Passwords are encrypted for security.
Upon successful registration, the user is automatically logged in and redirected to their profile page.
The user can log in using their credentials (email and password).
If the user provides incorrect login details, an error message should be shown.
User Story 2: Booking a Room
As a client,
I want to browse available rooms,
so that I can book a room for my stay.

Acceptance Criteria:
The user can view a list of available rooms with details (e.g., room type, price, images).
The user can select a room and specify the check-in/check-out dates.
The user can successfully complete the booking and receive a confirmation.
User Story 3: Admin Management of Users and Rooms
As an admin,
I want to manage user accounts and room availability,
so that I can oversee the platform’s operations effectively.

Acceptance Criteria:
The admin can view a list of all users, with the option to deactivate or delete accounts.
The admin can view all room bookings and manage availability.
The admin can add, update, or remove rooms from the platform.
The admin can update room prices and availability for specific dates.
User Story 4: User Profile Management
As a registered user,
I want to view and update my profile details,
so that I can keep my account information current.

Acceptance Criteria:
The user can view their profile page after logging in.
The user can update personal details (e.g., name, contact information).
The user can view their past bookings and cancel them if necessary.
User Story 5: File Upload (Room Images)
As a room manager/admin,
I want to upload images of rooms,
so that clients can view the rooms before making a booking.

Acceptance Criteria:
The admin can upload image files for each room.
Uploaded images are displayed on the room details page for clients.
Only admins can upload or update images for rooms.
Technologies Used
Backend: Spring Boot (Java)
Frontend: HTML, CSS (Bootstrap or Flexbox)
Authentication: Spring Security (with password encryption)
Database: MySQL
File Storage: Local file storage (for images)
Deployment: Docker
Version Control: GitHub
User Stories Format
The user stories have been written following the "As a [role], I want [feature] so that [benefit]" format. Each feature includes its acceptance criteria, which outlines the expected functionality and results.

Next Steps
Setup and implement backend using Spring Boot.
Develop frontend interface using Bootstrap or Flexbox.
Ensure responsive design for mobile devices.
Implement Docker deployment and unit testing.
