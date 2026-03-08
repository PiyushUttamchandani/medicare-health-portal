# 🏥 MediCare - Full Stack Healthcare Portal

**MediCare** is a robust MERN stack application designed to streamline the interaction between patients and healthcare providers. It features a comprehensive patient management system and an advanced doctor dashboard for real-time appointment handling.



## 🚀 Key Features

### 👤 Patient Portal
* **Personalized Profiles**: Sync and manage personal health data securely to the cloud.
* **Clinical Snapshot**: View BMI (Height/Weight), blood group, allergies, and current medications at a glance.
* **Appointment History**: Track the status of all past and upcoming consultations (Pending/Confirmed/Rejected).

### 👨‍⚕️ Doctor Dashboard
* **Real-time Management**: Review, accept, or reject patient appointments with optional custom notes.
* **Practice Analytics**: View total bookings, pending reviews, and today's patient count via interactive stats cards.
* **Patient Search**: Quickly find patient records using the integrated live search bar.

### 🔐 Security & UX
* **Role-Based Access**: Specialized protected routes for Patients, Doctors, and Admins.
* **Responsive Design**: Modern, clean UI built with Tailwind CSS and Lucide icons for seamless mobile and desktop use.

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JWT & Bcryptjs

## 📂 Project Structure

```text
MediCare/
├── Frontend/           # React.js application components and assets
├── Backend/            # Node.js API, routes, and database models
└── README.md           # Project documentation
