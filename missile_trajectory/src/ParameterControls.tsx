import React, { useState, useEffect } from "react"
import { type TrajectoryPoint, type ParameterProps } from "./types";


export const useStorageState = (key: string, initialState: TrajectoryPoint) => {
  const [value, setValue] = useState<TrajectoryPoint>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading localstorage key: ${key} `, error);
    }
    return initialState;
  });


  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localstorage key: ${key}`, error);
    }
  }, [value, key]);

  return [value, setValue] as const;
}

export const ParameterControls = ({ parameterValues, onChangeParameterData, parameterSubmit, onReset }: ParameterProps): React.JSX.Element => {

  const handleParameterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    onChangeParameterData((prevParameterData: TrajectoryPoint) => ({
      ...prevParameterData,
      [name]: parseFloat(value)
    }))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    parameterSubmit();
  }


  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <div>
          <label>Longitude: </label>
          <input
            name="longitude"
            type="range"
            min="-180"
            max="180"
            step="0.1"
            value={parameterValues.longitude}
            onChange={handleParameterChange}
          />
          <input
            name="longitude"
            type="number"
            min="-180"
            max="180"
            step="0.1"
            value={parameterValues.longitude}
            onChange={handleParameterChange}
          />
        </div>
        <div>
          <label>Latitude: </label>
          <input
            name="latitude"
            type="range"
            min="-90"
            max="90"
            step="0.1"
            value={parameterValues.latitude}
            onChange={handleParameterChange}
          />
          <input
            name="latitude"
            type="number"
            min="-90"
            max="90"
            step="0.1"
            value={parameterValues.latitude}
            onChange={handleParameterChange}
          />
        </div>

        <div>
          <label>Altitude (meters): </label>
          <input
            name="altitude"
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={parameterValues.altitude}
            onChange={handleParameterChange}
          />
          <input
            name="altitude"
            type="number"
            min="0"
            max="1000000"
            step="1000"
            value={parameterValues.altitude}
            onChange={handleParameterChange}
          />
        </div>
        <div>
          <div>
            <label>Beta (Bearing angle - Clockwise horizontal angle from
              north to direction of flight): </label>
          </div>
          <input
            name="beta"
            type="range"
            min="0"
            max="360"
            step="1"
            value={parameterValues.beta}
            onChange={handleParameterChange}
          />
          <input
            name="beta"
            type="number"
            min="0"
            max="360"
            step="1"
            value={parameterValues.beta}
            onChange={handleParameterChange}
          />
        </div>
        <div>
          <div>
            <label>Delta (Flight path angle - Angle between missile axis
              and local horizontal. Angle is positive when
              missile is climbing.)</label>
          </div>
          <input
            name="delta"
            type="range"
            min="-90"
            max="90"
            step="1"
            value={parameterValues.delta}
            onChange={handleParameterChange}
          />
          <input
            name="delta"
            type="number"
            min="-90"
            max="90"
            step="1"
            value={parameterValues.delta}
            onChange={handleParameterChange}
          />
        </div>
        <div>
          <div>
            <label>Starting Velocity (km / second), min is 4 km/s (~ Mach 11.6), max is 8 km/s (~ Mach 23.3)</label>
          </div>
          <input
            name="velocity"
            type="range"
            min="4"
            max="8"
            step="0.1"
            value={parameterValues.velocity}
            onChange={handleParameterChange}
          />
          <input
            name="velocity"
            type="number"
            min="4"
            max="8"
            step="0.1"
            value={parameterValues.velocity}
            onChange={handleParameterChange}
          />
        </div>

        <button type="submit">Start Simulation</button>

        <button type="button" onClick={onReset}>Reset</button>

      </div>
    </form>
  );
};