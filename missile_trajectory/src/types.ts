export interface TrajectoryPoint {
  time: number;
  latitude: number;
  longitude: number;
  beta: number,
  delta: number,
  altitude: number;
  velocity: number;
}

export interface TrajectoryHistory {
  trajectoryHistory: Array<TrajectoryPoint>
}

export interface ParameterProps {
  parameterValues: TrajectoryPoint,
  onChangeParameterData: React.Dispatch<React.SetStateAction<TrajectoryPoint>>,
  parameterSubmit: () => void;
  onReset: () => void;
}

export interface CesiumViewerInterface {
  cesiumRef: React.RefObject<HTMLDivElement | null>,
  startingValues: TrajectoryPoint,
  trajectoryHistory: Array<TrajectoryPoint>,
  simulationState: string
}

export interface InfoPanelProp {
  trajectoryHistory: Array<TrajectoryPoint>;
  parameterData: TrajectoryPoint;
}
