import { useState } from "react"
import { type TrajectoryPoint } from "./types";
  

export const useTrajectoryHistory = () => {
   const [trajectoryHistory, setTrajectoryData] = useState<TrajectoryPoint[]>([]);
   const addTrajectoryData = (trajectoryPoint: TrajectoryPoint) => {
    setTrajectoryData(prevTrajectoryData => [...prevTrajectoryData, trajectoryPoint]);
   };
   const clearTrajectoryHistory = () => {
    setTrajectoryData([]);
   }
    return {trajectoryHistory, addTrajectoryData, clearTrajectoryHistory};
}