# ✈️ Flight Reservation Application

A full-stack **Flight Reservation System** developed as an academic and learning project.  
The application allows users to search flights, make reservations, and manage bookings, while admins can manage flights and system data.

---

## 🚀 Technologies Used

### Frontend
- Angular
- TypeScript
- HTML / SCSS

### Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- JWT Authentication

### Database
- PostgreSQL

### Other
- RESTful API architecture
- Git & GitHub version control

---

## 📁 Project Structure

FlightReservationApp
│
├─ FlightReservationFrontend # Angular frontend application
│
└─ FlightReservationBackend # ASP.NET Core Web API backend


---

## ✨ Features

### User
- User registration & login
- Flight search
- Flight reservation
- View personal reservations

### Admin
- Add / update / delete flights
- Manage system data

### Security
- JWT-based authentication
- Role-based authorization (User / Admin)

---

## ⚙️ How to Run the Project

### Backend
```bash
cd FlightReservationBackend
dotnet restore
dotnet run

API runs on:
https://localhost:5001

Frontend
cd FlightReservationFrontend
npm install
ng serve

Frontend runs on:
http://localhost:4200

🗄️ Database Setup

PostgreSQL must be running
Update connection string in appsettings.json
Apply migrations if needed:
dotnet ef database update

🧪 Project Status

Core functionality implemented
Actively developed and improved
Used for learning full-stack development concepts

📌 Notes

This project is for educational purposes
Not intended for production use
Email verification / password reset features may be added later

👤 Author
Mustafa Salih ALP
Computer Engineering Student

📄 License
This project is not licensed for commercial use.

---

### Şimdi ne yapacaksın?

1️⃣ Repo kökünde `README.md` oluştur  
2️⃣ Bu içeriği yapıştır  
3️⃣ Commit & push:

```bash
git add README.md
git commit -m "Add project README"
git push
