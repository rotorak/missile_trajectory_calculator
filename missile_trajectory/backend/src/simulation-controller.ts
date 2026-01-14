import { ChildProcess } from "child_process";
import { EventEmitter } from "node:events";
import { spawn } from "child_process";

export type StartData = {
    longitude: number,
    latitude: number,
    beta: number,
    delta: number,
    altitude: number,
    velocity: number,
    time: number
}

const activeSimulations = new Map<string, {
    simulationId: string;
    eventName: string;
    process: ChildProcess | null;
    startTime: Date;
    status: string,
    initialPayload: StartData
}>();

const trajectoryEmitter = new EventEmitter();

export const initiateSimulation = async (initiationPayload: StartData) => {
    const start_time = new Date();
    const simulationId = `event-${Date.now()}-${Math.random()}`;
    const eventName = `trajectory-data-${simulationId}`;
    activeSimulations.set(simulationId, { simulationId, eventName, process: null, startTime: start_time, status: "pending", initialPayload: initiationPayload });

    return simulationId
}

export const spawnSimulation = (simulationId: string) => {
    const currentSimulation = activeSimulations.get(simulationId);
    if (!currentSimulation) {
        throw new Error(`Simulation ${simulationId} not found.`);
    }
    const eventName = currentSimulation.eventName;

    const args = [
        'missile.py',
        ...Object.entries(currentSimulation.initialPayload).flatMap(([key, value]) => [
            `--${key}`,
            value.toString()
        ])
    ];


    let process_spawn = spawn('python3', args);
    currentSimulation.process = process_spawn;
    currentSimulation.status = "ongoing";
    activeSimulations.set(simulationId, currentSimulation);
    process_spawn.on('error', error => {
        console.error("Spawn process error: ", error);
        trajectoryEmitter.emit(eventName, {
            status: 'error',
            message: `Spawn process error: ${error}`
        });
    });
    process_spawn.stderr.on('data', error => {
        console.error("Std error: ", error);
        trajectoryEmitter.emit(eventName, {
            status: 'error',
            message: `Std error: ${error}`
        });
    })
    process_spawn.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (let line of lines) {
            if (line.trim()) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.status === 'completed') {
                        trajectoryEmitter.emit(eventName, parsed);
                        cleanupSimulation(simulationId);
                        return;
                    }
                    trajectoryEmitter.emit(eventName, parsed);
                }
                catch (error) {
                    console.error("Parsing error: ", error);
                }
            }
        }
    });
    process_spawn.on('exit', code => {
        cleanupSimulation(simulationId);
        console.log("Process spawn exits with: ", code);
    });
    process_spawn.on('close', code => {
        cleanupSimulation(simulationId);
        console.log("Process spawn closed with: ", code);
    });



}

export const getEventName = (simulationId: string): string | null => {
    const simulation = activeSimulations.get(simulationId);
    return simulation ? simulation.eventName : null;
}

export const validateSimulation = (simulationId: string): boolean => {
    return activeSimulations.has(simulationId);
}

export const cleanupSimulation = (simulationId: string) => {
    const simulation = activeSimulations.get(simulationId);
    if (simulation?.process) {
        simulation.process.kill();
    }
    activeSimulations.delete(simulationId);
}

export const validatePayload = (payload: StartData): boolean => {
    console.log("Payload to be validated: ", payload);
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    try {
        return (
            typeof payload === 'object' &&
            typeof payload.time === 'number' &&
            typeof payload.latitude === 'number' &&
            typeof payload.longitude === 'number' &&
            typeof payload.altitude === 'number' &&
            typeof payload.velocity === 'number' &&
            typeof payload.beta === 'number' &&
            typeof payload.delta === 'number' &&
            !isNaN(payload.time) &&
            !isNaN(payload.latitude) &&
            !isNaN(payload.longitude) &&
            !isNaN(payload.altitude) &&
            !isNaN(payload.velocity) &&
            !isNaN(payload.beta) &&
            !isNaN(payload.delta)
        );
    } catch (error) {

        console.error("Error in validatePayload:", error);
        return false;
    }

};

export { trajectoryEmitter };
