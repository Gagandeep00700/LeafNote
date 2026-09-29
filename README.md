# LeafNote 

**LeafNote** is a modern, full-stack note-taking web application built on the MERN stack[cite: 1, 2]. It features a clean, responsive UI with smooth animations, JWT-based user authentication, real-time search, and instant note organization[cite: 1, 2].


---

##  Key Features

* **User Authentication:** Secure JWT-based registration and login system ensuring private user sessions[cite: 2].
* **Complete Note Management:** Full CRUD (Create, Read, Update, Delete) support for user notes[cite: 1, 2].
* **Note Pinning:** Pin essential notes directly to the top of your board for immediate access[cite: 1, 2].
* **Instant Search & Filter:** Dynamic, real-time search functionality to quickly query saved notes[cite: 1, 2].
* **Modern Animated UI:** Polished interface powered by Tailwind CSS utilities, glassmorphism blur effects, and Framer Motion transitions[cite: 1, 2].
* **Fully Responsive:** Optimised layout for desktop, tablet, and mobile views[cite: 1, 2].

---

##  Tech Stack & Architecture

### **Frontend**
* **Framework:** React (Vite)[cite: 2]
* **Styling:** Tailwind CSS[cite: 1, 2]
* **Animations:** Framer Motion[cite: 1, 2]
* **Deployment:** Vercel (`vercel.json`)[cite: 2]

### **Backend**
* **Runtime:** Node.js & Express.js (`index.js`)[cite: 1, 2]
* **Authentication:** JSON Web Token (JWT)
* **Database:** MongoDB & Mongoose (`db.js`, `notes.model.js`, `users.model.js`)[cite: 1, 2]
* **Deployment:** Vercel (`vercel.json`)[cite: 1]

---

##  Repository Structure

```text
LeafNote/
├── Backend/
│   ├── database/
│   │   └── db.js
│   ├── models/
│   │   ├── notes.model.js
│   │   └── users.model.js
│   ├── index.js
│   ├── package.json
│   ├── utilities.js
│   └── vercel.json
└── Frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Home/
    │   │   │   ├── AddEditNotes.jsx
    │   │   │   └── Home.jsx
    │   │   ├── Login/
    │   │   └── Signup/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── eslint.config.js
    ├── package.json
    ├── vite.config.js
    └── vercel.json
```
##  Getting Started

### Prerequisites
* **Node.js** (v16.x or higher)
* **npm** or **yarn**
* **MongoDB** database instance (Local or MongoDB Atlas)

---

### Installation & Local Setup

#### 1. Clone the repository
```bash
git clone [https://github.com/Gagandeep00700/LeafNote.git](https://github.com/Gagandeep00700/LeafNote.git)
cd LeafNote
```

#### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm start
```

#### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` folder:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
---

##  License

Distributed under the MIT License.
