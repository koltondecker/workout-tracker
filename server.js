const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const db = require("./models");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get("/api/workouts", async (req, res) => {
  try {
    const workouts = await db.Workout.aggregate(
      [
        {
          $addFields: {
            totalDuration: {
              $sum: "$exercises.duration"
            }
          }
        }
      ]
    );
    res.json(workouts);
  } catch (error) {
    res.json(error);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.resolve("./public/exercise.html"));
});

app.get("/exercise/:id", async (req, res) => {
  try {
    const workouts = await db.Workout.find({ _id: req.params.id });
    res.json(workouts);
  } catch (error) {
    res.json(error);
  }
});

app.post("/api/workouts", async (req, res) => {
  try {
    const workout = await db.Workout.create(
      {
        day: new Date().setDate(new Date().getDate()),
        exercises: req.body
      }
    );
    res.json(workouts);
  } catch (error) {
    res.json(error)
  }
});

app.put("/api/workouts/:id", async (req, res) => {
  const workoutId = req.params.id;
  
  try {
    if(!workoutId) {
      const newWorkout = await db.Workout.create({});

      const workouts = await newWorkout.updateOne({
        $push: {
          "exercises": req.body
        }
      });

      newWorkout.save();
    } else {
      const workouts = await db.Workout.updateOne(
        {
          _id: req.params.id
        },
        {
          $push: {
            "exercises": req.body
          }
        }
      );
    }

    res.json(workouts);
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});