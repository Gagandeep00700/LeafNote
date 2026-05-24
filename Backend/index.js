import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import connectDB from './database/db.js'
import cors from 'cors'
import User from './models/users.model.js'
import Note from './models/notes.model.js'
import authenticateToken from './utilties.js'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// 1. Initialize the database connection immediately
connectDB();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://leaf-note-ui.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, "https://leaf-note-ui.vercel.app");
      }
      
      // Dynamic Vercel check suffix
      const isMyVercelDomain = origin.endsWith("-gagandeep00700s-projects.vercel.app") || origin === "https://leaf-note-ui.vercel.app";
      
      if (allowedOrigins.includes(origin) || isMyVercelDomain) {
        return callback(null, origin); 
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" })
})

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" })
    }
    try {
        const isUser = await User.findOne({ email })
        if (isUser) {
            return res.status(409).json({ error: true, message: "User Already Exists" });
        }  
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ fullName, email, password: hashedPassword })
        await user.save();

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '3600m'
        })
        
        return res.status(201).json({
            error: false,
            message: "Account created successfully",
            accessToken,
        });
    } catch {
        return res.status(500).json({ error: true, message: "Server Error" })
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Email and Password are required" })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: true, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: true, message: "Invalid credentials" })
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '3600m'
        })

        return res.json({
            error: false,
            message: "Login successful",
            email,
            accessToken
        });
    } catch {
        return res.status(500).json({ error: true, message: "Server error" })
    }
})

app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        if (!user) return res.status(401).json({ error: true, message: "Unauthorized" })
        return res.json({
            user: {
                fullName: user.fullName,
                email: user.email,
                _id: user._id,
                createdOn: user.createdOn
            },
            message: ""
        })
    } catch {
        return res.status(500).json({ error: true, message: "Server error" })
    }
})

app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body
    const userId = req.user.userId

    if (!title || !content) {
        return res.status(400).json({ error: true, message: "Title and Content are required" })
    }
    try {
        const note = new Note({ title, content, tags: tags || [], userId });
        await note.save();

        return res.json({ error: false, note, message: "Note added successfully" })
    } catch {
        return res.status(500).json({ error: true, message: "Server error" })
    }
})

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const { title, content, tags, isPinned } = req.body
    const noteId = req.params.noteId
    const userId = req.user.userId

    try {
        const note = await Note.findOne({ _id: noteId, userId })
        if (!note) return res.status(404).json({ error: true, message: "Note not found" })
        
        if (title) note.title = title
        if (content) note.content = content;
        if (tags) note.tags = tags
        if (typeof isPinned === "boolean") note.isPinned = isPinned

        await note.save()

        return res.json({ error: false, note, message: "Note updated successfully" })
    } catch {
        return res.status(500).json({ error: true, message: "Server error" })
    }
})

app.get("/get-all-notes", authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId }).sort({ isPinned: -1 })
        return res.json({ error: false, notes, message: "All notes retrieved successfully" })
    } catch {
        return res.status(500).json({ error: true, message: "Server error" })
    }
})

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId
    const userId = req.user.userId

    try {
        const note = await Note.findOne({ _id: noteId, userId })
        if (!note) return res.status(404).json({ error: true, message: "Note not found" })
        
        await Note.deleteOne({ _id: noteId })
        return res.json({ error: false, message: "Note deleted successfully" })
    } catch {
        return res.status(500).json({ error: true, message: "Server error" })
    }
})

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body
    const userId = req.user.userId

    try {
        const note = await Note.findOne({ _id: noteId, userId })
        if (!note) return res.status(404).json({ error: true, message: "Note not found" })
        
        note.isPinned = !!isPinned
        await note.save();
        return res.json({ error: false, note, message: "Pinned status updated" })
    } catch {
        return res.status(500).json({ error: true, message: "Server error" })
    }
})

app.get("/search-notes", authenticateToken, async (req, res) => {
    const { query } = req.query
    const userId = req.user.userId

    if (!query) return res.status(400).json({ error: true, message: "Query is required" })

    try {
        const notes = await Note.find({
            userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } },
            ],
        })

        return res.json({ error: false, notes, message: "Matching notes found" })
    } catch {
        return res.status(500).json({ error: true, message: "Server error" }) 
    }
})

const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app