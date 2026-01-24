# 🎨 Drawdle - Daily Drawing Web Application

A full-stack web application inspired by Wordle that challenges users to create, save, and manage daily drawings. Built with HTML5 Canvas, Express.js, JWT authentication, and SQLite database.

![Drawdle](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Features
- **Daily Drawing Prompts**: New creative prompt every day to inspire your artwork
- **Interactive Canvas**: Full-featured drawing interface with brush and eraser tools
- **User Authentication**: Secure registration and login with JWT tokens
- **Personal Gallery**: View and manage all your saved drawings
- **Persistent Storage**: All drawings saved to SQLite database
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **6+ RESTful API Endpoints**: Complete backend for user and drawing management
- **JWT Authentication**: Secure session management with token-based auth
- **HTML5 Canvas API**: Smooth drawing experience with touch support
- **Axios Integration**: Efficient frontend-backend communication
- **SQL Database**: Persistent data storage with SQLite3
- **Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure and Canvas API for drawing
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Axios** - HTTP client for API requests
- **Google Fonts** - Poppins typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight SQL database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

## 📋 Prerequisites

Before running this application, make sure you have installed:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Extract the Project
```bash
# If cloning from Git
git clone <repository-url>
cd drawdle-project

# Or extract the zip file and navigate to the directory
cd drawdle-project
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- express
- bcryptjs
- jsonwebtoken
- cors
- sqlite3
- dotenv

### 3. Configure Environment Variables
The `.env` file is already included with default values:
```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a random secure string in production!

### 4. Start the Server
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
drawdle-project/
├── public/                 # Frontend files
│   ├── css/
│   │   └── styles.css     # Application styles
│   ├── js/
│   │   └── app.js         # Frontend JavaScript
│   └── index.html         # Main HTML file
├── server.js              # Express server & API endpoints
├── package.json           # Project dependencies
├── .env                   # Environment variables
├── drawdle.db            # SQLite database (auto-created)
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication Endpoints

#### 1. Register User
- **POST** `/api/register`
- **Body**: `{ username, email, password }`
- **Response**: `{ token, user }`

#### 2. Login User
- **POST** `/api/login`
- **Body**: `{ email, password }`
- **Response**: `{ token, user }`

### Drawing Endpoints (Requires Authentication)

#### 3. Save Drawing
- **POST** `/api/drawings`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, drawingData, date }`

#### 4. Get All User Drawings
- **GET** `/api/drawings`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of user's drawings

#### 5. Get Specific Drawing
- **GET** `/api/drawings/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Drawing details with image data

#### 6. Delete Drawing
- **DELETE** `/api/drawings/:id`
- **Headers**: `Authorization: Bearer <token>`

### Utility Endpoints

#### 7. Get Daily Prompt
- **GET** `/api/daily-prompt`
- **Response**: Today's drawing prompt

#### 8. Get Today's Drawing
- **GET** `/api/drawings/today/:date`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User's drawing for specified date

## 🎮 How to Use

### First Time Setup
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials

### Creating Your First Drawing
1. View today's creative prompt at the top of the page
2. Use the drawing tools:
   - **Brush Tool** ✏️: Draw with selected color
   - **Eraser Tool** 🧹: Erase parts of your drawing
   - **Clear Canvas** 🗑️: Start over
3. Adjust brush size with the slider (1-50px)
4. Pick your color with the color picker
5. Give your drawing a title
6. Click **Save Drawing** 💾

### Managing Your Gallery
1. Click **My Gallery** in the navigation
2. View all your saved drawings
3. Click any drawing to view it full size
4. Delete drawings you no longer want

## 🔐 Security Features

- **Password Hashing**: All passwords encrypted with bcrypt (10 rounds)
- **JWT Tokens**: Secure session management (7-day expiration)
- **SQL Injection Protection**: Parameterized queries
- **Input Validation**: Server-side validation on all endpoints
- **CORS Protection**: Configurable cross-origin requests

## 🎨 Drawing Features

- **Smooth Drawing**: Real-time canvas rendering
- **Touch Support**: Works on tablets and touchscreens
- **Variable Brush Size**: 1-50 pixels
- **Color Picker**: Full color spectrum
- **Eraser Tool**: Remove unwanted strokes
- **Clear Canvas**: Quick reset functionality
- **Auto-save Prevention**: Confirmation before clearing

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1920px+)
- Laptops (1366px+)
- Tablets (768px+)
- Mobile phones (320px+)

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, change it in `.env`:
```env
PORT=3001
```

### Database Issues
If you encounter database errors:
```bash
# Delete the database file
rm drawdle.db

# Restart the server (it will recreate the database)
npm start
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install
```

## 🔄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Drawings Table
```sql
CREATE TABLE drawings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  drawing_data TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE(user_id, date)
)
```

### Daily Prompts Table
```sql
CREATE TABLE daily_prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,
  prompt TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🚀 Future Enhancements

Potential features for future versions:
- Social features (sharing drawings)
- Drawing challenges and competitions
- More drawing tools (shapes, fill, layers)
- Export drawings in different formats
- Drawing time limits (like Wordle)
- Leaderboard system
- Dark mode theme
- Drawing tutorials

## 📄 License

This project is licensed under the MIT License - feel free to use it for your own projects!

## 👨‍💻 Developer Notes

### Built With Love Using:
- **Figma** - UI/UX Design
- **HTML5 Canvas API** - Drawing functionality
- **Express.js** - Backend framework
- **JWT** - Authentication
- **SQLite** - Database
- **Axios** - HTTP requests

### Key Implementation Details:
- Canvas drawing uses event listeners for mouse/touch
- Drawing data stored as base64 PNG images
- JWT tokens stored in localStorage
- API uses middleware for authentication
- Responsive design with CSS Grid and Flexbox

## 🤝 Contributing

Feel free to submit issues, create pull requests, or suggest new features!

## 📞 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section
2. Review the API documentation
3. Check the browser console for errors
4. Ensure all dependencies are installed

---

**Made with ❤️ by the Drawdle Team**

Happy Drawing! 🎨
