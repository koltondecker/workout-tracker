const db = require("../models");

module.exports = (app) => {
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

    app.get("/api/workouts/range", async (req, res) => {
        try {
            const workouts = await db.Workout.aggregate([
                {
                    $sort: {
                        day: -1
                    }
                },
                {
                    $limit: 7
                },
                {
                    $addFields: {
                        totalDuration: {
                            $sum: "$exercises.duration"
                        }
                    }
                }
            ]);
            console.log(workouts);
            workouts.reverse();
            res.json(workouts);
        } catch (error) {
            res.json(error);
        }
    });

    app.post("/api/workouts", async (req, res) => {
        try {
            const workout = await db.Workout.create({});
            res.json(workout);
        } catch (error) {
            res.json(error)
        }
    });

    app.put("/api/workouts/:id", async (req, res) => {
        const workoutId = req.params.id;

        try {
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

            res.json(workouts);
        } catch (error) {
            res.json(error);
        }
    });
}