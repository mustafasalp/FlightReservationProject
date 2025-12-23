# ✈️ Flight Reservation Project

This is a full-stack **Flight Reservation System** built as an academic learning project.  
It enables users to search flights, make reservations, and view their bookings, while admins can manage flights and system data.

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

## 🧱 Project Structure
FlightReservationProject/ </br>
├─ FlightReservationFrontend # Angular frontend app </br>
└─ FlightReservationBackend # ASP.NET Core Web API backend </br>

---

## ✨ Features

### 💻 User
- Register & login with JWT  
- Search flights  
- View available flights  
- Make reservations  
- View personal reservation list

### 🛠 Admin
- Add new flights  
- Update existing flights  
- Delete flights  
- Automatic seat generation on flight creation

### 🔐 Security
- JWT-based authentication  
- Role-based authorization (User / Admin)

---

## ⚙️ Installation & Running

Restore packages:

dotnet restore


Run the API:

dotnet run


Default backend URL:
https://localhost:5001

🟦 Frontend

Navigate to frontend folder:

cd FlightReservationFrontend


Install node packages:

npm install


Start Angular dev server:

ng serve


Frontend runs on:
http://localhost:4200

🗄 Database Setup

Make sure PostgreSQL is running

Update connection string in appsettings.json

Apply migrations (if not applied yet):

dotnet ef database update

🧠 How It Works

The Angular frontend uses a REST API to communicate with the backend.

The backend handles business logic, database access, and authentication.

JWT tokens are stored in localStorage for authenticated API calls.

📌 Notes

This project is meant for learning purposes

Not intended for production use yet

Features like email verification or password reset can be added later

🧑‍💻 Author

Mustafa Salih ALP
Computer Engineering Student
Izmir Katip Çelebi University

📄 License

This project is for educational use and does not have a commercial license.

---

## 📍 Next Steps After Adding README

1. Save this as `README.md` in the root of your repo.
2. Then run:

```bash
git add README.md
git commit -m "Add detailed project README"
git push origin main

### 🧩 Backend

1. Navigate to backend folder:
   ```bash
   cd FlightReservationBackend
