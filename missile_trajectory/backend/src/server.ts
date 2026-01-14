import express, { type Request, type Response } from "express";
import { initiateSimulation, getEventName, trajectoryEmitter, validateSimulation, spawnSimulation, validatePayload } from "./simulation-controller.js"
import { spawnSync } from "child_process";

import cors from "cors";
console.log("Server starting...");

type TrajectoryData = {
  latitude: number,
  longitude: number,
  altitude: number,
  beta: number,
  delta: number,
  velocity: number,
  time: number,
}

// Add error handler for unhandled errors
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();
console.log("Server starting...");

// Force port 8080 for Cloud Run
const PORT = 8080;
console.log('[PORT] Using port:', PORT);

console.log('[PORT] process.env.PORT:', process.env.PORT);
console.log('[PORT] Parsed PORT value:', PORT);
console.log('[PORT] All env vars with PORT:', Object.keys(process.env).filter(k => k.includes('PORT')));
const cors_options = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors(cors_options));

app.get("/", (req: Request, res: Response) => {
  res.send("Node server");
});

app.post('/api/trajectory/start', async (req: Request, res: Response) => {
  console.log("=== POST /api/trajectory/start handler called ===");
  const initiationPayload = req.body;

  console.log("Payload structure: ", initiationPayload);
  console.log("req.body type:", typeof req.body, "is null?", req.body === null, "is undefined?", req.body === undefined);

  try {
    if (validatePayload(initiationPayload)) {
      try {
        const simulationId = await initiateSimulation(initiationPayload);
        res.status(200).json({ simulationId, message: "Payload succesfully validated and simulation successfully started." });
      }
      catch (error) {
        console.error("Payload validated, but error in attempting to run simulation: ", error);
        res.status(500).send("Failed to start simulation.")
      }
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid payload structure" });
    return;
  }


});

app.get('/api/trajectory-stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  try {
    const simulationId = req.query.simulationId as string;
    if (!req.query.simulationId) {
      console.error("Cannot receive simulationId from client.");
      res.status(400).send("Missing simulationId parameter");
      res.end();
      return;
    }
    if (!validateSimulation(req.query.simulationId as string)) {
      res.status(404).send("Simulation not found.");
      res.end();
      return;
    }
    const eventName = getEventName(simulationId);
    if (!eventName) {
      res.status(404).send("Event not found for associated simulationId.");
      res.end();
      return;
    }
    spawnSimulation(simulationId);
    res.write(`data: ${JSON.stringify({ status: 'connected' })}\n\n`);

    const dataHandler = (data: TrajectoryData) => {
      try {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
      catch (error) {
        console.error("Issue with dataHandler: ", error);
        trajectoryEmitter.removeListener(eventName, dataHandler);
        try {
          res.write(`data: ${JSON.stringify({ status: 'error' })}\n\n`);
        }
        catch (error) {
          console.error("res.write() fails.");
        }
        res.end();
      }

    }
    trajectoryEmitter.on(eventName, dataHandler);

    req.on('close', () => {
      trajectoryEmitter.removeListener(eventName, dataHandler);
      res.end();
    });
  }
  catch (error) {
    console.error("Issue with connecting: ", error);
    res.end();
    return;
  }
})


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  try {
    const pythonCheck = spawnSync('python3', ['--version']);
    console.log(`Python3 available: ${pythonCheck.status === 0}`);
    if (pythonCheck.status !== 0) {
      console.error('Python3 check failed:', pythonCheck.stderr?.toString());
    }
  } catch (error) {
    console.error("Error checking Python3:", error);
  }
}).on('error', (error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});