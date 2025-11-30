const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Course = require('./models/Course');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhupeshsingh778_db_user:qwerty12345@cluster0.u70wcn8.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes

// Courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enquiries
app.get('/api/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Force reseed endpoint (for development)
app.get('/api/reseed', async (req, res) => {
  try {
    await Course.deleteMany({});
    const initialCourses = [
        {
            title: "Class 11 - JEE Mains & Advanced",
            grade: "Class 11",
            description: "Complete 2-year foundation program for JEE aspirants. Covers Physical, Organic, and Inorganic Chemistry from basics to advanced level.",
            duration: "2 Years",
            schedule: "Mon, Wed, Fri (4:00 PM - 7:00 PM)",
            price: "₹45,000 / Year",
            features: ["Daily Practice Papers (DPP)", "Weekly Tests", "1-on-1 Doubt Solving", "Video Lectures Access"],
            color: "cyan",
            categories: ["jee"]
        },
        {
            title: "Class 12 - NEET Medical",
            grade: "Class 12",
            description: "Intensive 1-year program focusing on NCERT mastery and problem-solving speed for NEET UG.",
            duration: "1 Year",
            schedule: "Tue, Thu, Sat (4:00 PM - 7:00 PM)",
            price: "₹40,000 / Year",
            features: ["NCERT Line-by-Line Analysis", "Previous Year Questions", "All India Test Series", "Printed Study Material"],
            color: "pink",
            categories: ["neet"]
        },
        {
            title: "Dropper's Batch - JEE/NEET",
            grade: "Dropper",
            description: "Rigorous program for repeaters. Fast-track syllabus coverage with focus on high-weightage topics.",
            duration: "8 Months",
            schedule: "Mon to Sat (9:00 AM - 1:00 PM)",
            price: "₹55,000",
            features: ["Daily 4 Hrs Classes", "Rank Booster Package", "Personal Mentorship", "Unlimited Test Series"],
            color: "purple",
            categories: ["jee", "neet"]
        },
        {
            title: "Foundation Pro - Class 9th & 10th",
            grade: "Class 9-10",
            description: "Early start for competitive exams. Focus on Olympiads and strong basics in Science and Math.",
            duration: "1 Year",
            schedule: "Weekends (10:00 AM - 2:00 PM)",
            price: "₹30,000 / Year",
            features: ["Weekend Classes", "Science & Math Focus", "NTSE Prep", "Olympiad Training"],
            color: "green",
            categories: ["foundation"]
        },
        {
            title: "Crash Course - JEE Main",
            grade: "Crash Course",
            description: "Intensive 45-day revision program. Rapid concept coverage with question banks and daily tests.",
            duration: "45 Days",
            schedule: "Daily (9:00 AM - 5:00 PM)",
            price: "₹25,000",
            features: ["Daily Tests", "Short Notes", "Rank Booster", "Quick Revision"],
            color: "yellow",
            categories: ["jee"]
        },
        {
            title: "NEET Biology Special",
            grade: "Class 11-12",
            description: "Dedicated Biology coaching for NEET aspirants with focus on NCERT and previous year questions.",
            duration: "1 Year",
            schedule: "Mon, Wed, Fri (5:00 PM - 7:00 PM)",
            price: "₹35,000 / Year",
            features: ["NCERT Mastery", "Diagram Practice", "Memory Techniques", "Biology Test Series"],
            color: "green",
            categories: ["neet"]
        }
    ];
    await Course.insertMany(initialCourses);
    res.json({ message: 'Database reseeded successfully', count: initialCourses.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed initial data if empty
app.get('/api/seed', async (req, res) => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      const initialCourses = [
          {
              title: "Class 11 - JEE Mains & Advanced",
              grade: "Class 11",
              description: "Complete 2-year foundation program for JEE aspirants. Covers Physical, Organic, and Inorganic Chemistry from basics to advanced level.",
              duration: "2 Years",
              schedule: "Mon, Wed, Fri (4:00 PM - 7:00 PM)",
              price: "₹45,000 / Year",
              features: ["Daily Practice Papers (DPP)", "Weekly Tests", "1-on-1 Doubt Solving", "Video Lectures Access"],
              color: "cyan",
              categories: ["jee"]
          },
          {
              title: "Class 12 - NEET Medical",
              grade: "Class 12",
              description: "Intensive 1-year program focusing on NCERT mastery and problem-solving speed for NEET UG.",
              duration: "1 Year",
              schedule: "Tue, Thu, Sat (4:00 PM - 7:00 PM)",
              price: "₹40,000 / Year",
              features: ["NCERT Line-by-Line Analysis", "Previous Year Questions", "All India Test Series", "Printed Study Material"],
              color: "pink",
              categories: ["neet"]
          },
          {
              title: "Dropper's Batch - JEE/NEET",
              grade: "Dropper",
              description: "Rigorous program for repeaters. Fast-track syllabus coverage with focus on high-weightage topics.",
              duration: "8 Months",
              schedule: "Mon to Sat (9:00 AM - 1:00 PM)",
              price: "₹55,000",
              features: ["Daily 4 Hrs Classes", "Rank Booster Package", "Personal Mentorship", "Unlimited Test Series"],
              color: "purple",
              categories: ["jee", "neet"]
          },
          {
              title: "Foundation Pro - Class 9th & 10th",
              grade: "Class 9-10",
              description: "Early start for competitive exams. Focus on Olympiads and strong basics in Science and Math.",
              duration: "1 Year",
              schedule: "Weekends (10:00 AM - 2:00 PM)",
              price: "₹30,000 / Year",
              features: ["Weekend Classes", "Science & Math Focus", "NTSE Prep", "Olympiad Training"],
              color: "green",
              categories: ["foundation"]
          },
          {
              title: "Crash Course - JEE Main",
              grade: "Crash Course",
              description: "Intensive 45-day revision program. Rapid concept coverage with question banks and daily tests.",
              duration: "45 Days",
              schedule: "Daily (9:00 AM - 5:00 PM)",
              price: "₹25,000",
              features: ["Daily Tests", "Short Notes", "Rank Booster", "Quick Revision"],
              color: "yellow",
              categories: ["jee"]
          },
          {
              title: "NEET Biology Special",
              grade: "Class 11-12",
              description: "Dedicated Biology coaching for NEET aspirants with focus on NCERT and previous year questions.",
              duration: "1 Year",
              schedule: "Mon, Wed, Fri (5:00 PM - 7:00 PM)",
              price: "₹35,000 / Year",
              features: ["NCERT Mastery", "Diagram Practice", "Memory Techniques", "Biology Test Series"],
              color: "green",
              categories: ["neet"]
          }
      ];
      await Course.insertMany(initialCourses);
      res.json({ message: 'Seeded' });
    } else {
      res.json({ message: 'Already has data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});