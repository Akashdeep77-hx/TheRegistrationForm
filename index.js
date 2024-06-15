const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Middleware to parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(
    `mongodb+srv://${username}:${password}@bellaciao.j12fci6.mongodb.net/registrationFormDB?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true, // Can be removed
        useUnifiedTopology: true, // Can be removed
    }
).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});

// Registration schema and model
const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Registration = mongoose.model("Registration", registrationSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({email: email});
        //Check for existing user
        if(!existingUser){
            const newRegistration = new Registration({ 
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success")
        }
        else{
            console.log("User already exist");
            res.redirect("/success");
        }

        // Create a new registration document 
        const newRegistration = new Registration({ name, email, password });

        // Save the document to the database
        await newRegistration.save();

        res.redirect("/success");
    } catch (error) {
        console.error("Error during registration:", error);
        res.redirect("/error");
    }
});

// Define success and error routes
app.get("/success", (req, res) => {
    res.send("Registration successful!");
});

app.get("/error", (req, res) => {
    res.send("An error occurred during registration.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
