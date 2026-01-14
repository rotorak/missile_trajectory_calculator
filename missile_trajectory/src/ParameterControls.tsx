import React, { useState, useEffect } from "react"
import { type TrajectoryPoint, type ParameterProps } from "./types";
import "./styles/mobile.css"

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
    <form onSubmit={handleFormSubmit} className="parameter-controls-mobile">
      <div className="text-xs md:text-base space-y-2 md:space-y-4">
        {/* Row 1: Longitude and Latitude */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-0">
          <div className="w-1/2 md:w-full">
            <label className="block mb-1">Longitude: </label>
            <input
              name="longitude"
              type="range"
              min="-180"
              max="180"
              step="0.1"
              value={parameterValues.longitude}
              onChange={handleParameterChange}
              className="w-full mb-1"
            />
            <input
              name="longitude"
              type="number"
              min="-180"
              max="180"
              step="0.1"
              value={parameterValues.longitude}
              onChange={handleParameterChange}
              className="w-full"
            />
          </div>
          <div className="w-1/2 md:w-full">
            <label className="block mb-1">Latitude: </label>
            <input
              name="latitude"
              type="range"
              min="-90"
              max="90"
              step="0.1"
              value={parameterValues.latitude}
              onChange={handleParameterChange}
              className="w-full mb-1"
            />
            <input
              name="latitude"
              type="number"
              min="-90"
              max="90"
              step="0.1"
              value={parameterValues.latitude}
              onChange={handleParameterChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Row 2: Altitude and Beta */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-0">
          <div className="w-1/2 md:w-full">
            <label className="block mb-1">Altitude (meters): </label>
            <input
              name="altitude"
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={parameterValues.altitude}
              onChange={handleParameterChange}
              className="w-full mb-1"
            />
            <input
              name="altitude"
              type="number"
              min="0"
              max="1000000"
              step="1000"
              value={parameterValues.altitude}
              onChange={handleParameterChange}
              className="w-full"
            />
          </div>
          <div className="w-1/2 md:w-full">
            <label className="block mb-1 text-[0.65rem] md:text-base">Beta (Bearing angle): </label>
            <input
              name="beta"
              type="range"
              min="0"
              max="360"
              step="1"
              value={parameterValues.beta}
              onChange={handleParameterChange}
              className="w-full mb-1"
            />
            <input
              name="beta"
              type="number"
              min="0"
              max="360"
              step="1"
              value={parameterValues.beta}
              onChange={handleParameterChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Row 3: Delta and Velocity */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-0">
          <div className="w-1/2 md:w-full">
            <label className="block mb-1 text-[0.65rem] md:text-base">Delta (Flight path angle): </label>
            <input
              name="delta"
              type="range"
              min="-90"
              max="90"
              step="1"
              value={parameterValues.delta}
              onChange={handleParameterChange}
              className="w-full mb-1"
            />
            <input
              name="delta"
              type="number"
              min="-90"
              max="90"
              step="1"
              value={parameterValues.delta}
              onChange={handleParameterChange}
              className="w-full"
            />
          </div>
          <div className="w-1/2 md:w-full">
            <label className="block mb-1 text-[0.65rem] md:text-base">Velocity (km/s): </label>
            <input
              name="velocity"
              type="range"
              min="4"
              max="8"
              step="0.1"
              value={parameterValues.velocity}
              onChange={handleParameterChange}
              className="w-full mb-1"
            />
            <input
              name="velocity"
              type="number"
              min="4"
              max="8"
              step="0.1"
              value={parameterValues.velocity}
              onChange={handleParameterChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Row 4: Buttons */}
        <div className="flex flex-row gap-2 justify-center pt-2">
          <button type="submit" className="px-3 py-1.5 text-[0.7rem] md:text-sm">Start Simulation</button>
          <button type="button" onClick={onReset} className="px-3 py-1.5 text-[0.7rem] md:text-sm">Reset</button>
        </div>
      </div>
    </form>
  );
};