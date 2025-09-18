# 🎉 Hobbly Project

---

## 📖 Short Description
**Hobbly Project** is a web application designed for convenient searching, viewing, and organizing events. Its goal is to help users quickly find interesting events in their city or region, view them on a map, share with friends, and easily access tickets or registration. The project targets both event attendees and organizers, who can create and manage their own events through a simple interface.

---

## 🎯 Main Goal
To simplify event discovery for users and provide tools for organizers to create and manage events efficiently.

---

## 🔹 Brief Overview of Functionality
- Viewing events in a convenient list  
- Viewing events on an interactive map  
- Creating your own events (available only for organizers)  
- Filtering events by categories, dates, and other parameters  
- Using external links for ticket purchases, reservations, or additional information  

---

## 🛠 Technologies and Stack
- **Frontend:** React, CSS, HTML  
- **Backend / API:** C# (.NET), Axios, Node.js
- **Database:** MongoDB  
- **Cloud Services:** Azure  
- **Other Tools:** Figma (design), Git + GitHub (version control and collaboration)  

---

## ⚙️ Installation and Running

### 📦 Required Dependencies
- Node.js  
- .NET SDK  
- MongoDB  

### 🚀 Commands for Local Setup
run frontend <br/>
`
cd frontend-app
npm install
npm run dev
`<br/><br/>
run backend<br/>
`
cd backend/api
dotnet run
`

### 🔧 Environment Setup
The `.env` file is used to store configuration data.  

**Example:**<br/><br/>
`
API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
`

---

## 🏗 Project Architecture

### 🌐 Frontend
**frontend/frontend-app/**  
- 📦 build/  
- 📦 node_modules/  
- 🌐 public/  
- 🗂 src/  
  - 🖼 assets/  
    - 🖼 image/  
    - 🖌 icons/  
  - 📄 pages/  
- 📄 package.json  
- 📄 other .json files  

### ⚙️ Backend
**backend/api/**  
- 📦 bin/  
- 📂 controllers/  
- 📂 models/  
- 📦 obj/  
- ⚙️ properties/  
- 📄 api.http  
- 📄 *.cs  
- 📄 *.csproj  
- 📄 appsettings.json / other .json files  

### 🗂 Root Files
- 📄 README.md  
- 📄 LICENSE  
- 📄 .gitignore  
- 📄 other configuration files


### 🔗 Frontend and Backend Interaction
- Frontend sends HTTP requests (via Axios) to the .NET API  
- Backend processes requests, interacts with MongoDB, and returns data in JSON format  
- Frontend displays data (event lists or map view)  

---

## 📡 API Documentation

### 🔑 Authentication
- `POST /auth/register` – user registration  
- `POST /auth/login` – user login  

### 🌐 Events (External API)
- `GET https://api.hel.fi/linkedevents/v1/event/?page={page}`  

### 🏢 Events (Internal, planned)
- `POST /api/events` – create event (organizers)  
- `GET /api/events/:id` – get event details  
- `PUT /api/events/:id` – edit event  
- `DELETE /api/events/:id` – delete event  

### 🛡 Admin Functions (planned)
- `GET /api/admin/events` – get all events  
- `GET /api/admin/users` – get all users  
- `GET /api/admin/organizers` – get all organizers  

---

## ⚙️ Functional Features
- User authentication  
- Viewing events (list and map)  
- Event filtering  
- External links (tickets, reservations)  
- **Organizer functions:** create, edit, delete own events, manage event details  
- **Admin functions (planned):** manage all events, users, and organizers  

---

## 🎨 UI / UX Components
- **Main Components:** `Navbar`, `Footer`, `EventCard`, `FilterPanel`, `MapView`  
- **Authentication and Roles:** `RegisterPage`, `LoginPage`, `PasswordRecoveryPage`, `RoleSelection`  
- **Styling:** React + CSS, design in Figma  

---

## ⚠️ Limitations and Known Issues
- Organizer and admin panels are not yet implemented  
- Full access to events across Finland is not available  
- Minor delays when loading events from the external API (Helsinki Linked Events)  

---

## 👥 Contacts and Contribution

### 👥 Project & Team

We are a team of 4 people working on Hobbly Project:

- [<img src="https://github.com/WellNoteOne.png" width="32" height="32"> Valentine](https://github.com/WellNoteOne) – backend / frontend  
- [<img src="https://github.com/Souman-ux.png" width="32" height="32"> Souman](https://github.com/Souman-ux) – frontend  
- [<img src="https://github.com/LeoBC24.png" width="32" height="32"> Leonardo](https://github.com/LeoBC24) – backend / UI/UX  
- [<img src="https://github.com/ArtemSpr.png" width="32" height="32"> Artem](https://github.com/ArtemSpr) – backend / frontend


💻 Feel free to check out our GitHub profiles and contributions!


### How to Contribute
- Create Pull Requests for adding new features or fixing bugs  
- Conduct code reviews before merging changes  
- Use Git and GitHub for version control and collaboration  

---

## 📄 License
MIT
