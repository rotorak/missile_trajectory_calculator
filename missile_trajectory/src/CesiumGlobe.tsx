import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useRef, useCallback } from 'react';
import { type TrajectoryPoint, type CesiumViewerInterface } from './types';


const globe_options = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
}

// first useEffect generates refs for later rendering and establishes Cesium viewer frame
const CesiumViewer = ({ cesiumRef, startingValues, trajectoryHistory, simulationState }: CesiumViewerInterface) => {

  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const startLabelRef = useRef<Cesium.Entity | null>(null);
  const heightLineRef = useRef<Cesium.Entity | null>(null);
  const missileEntityRef = useRef<Cesium.Entity | null>(null);
  const trajectoryRef = useRef<Cesium.Entity | null>(null);
  const trajectoryHistoryRef = useRef<TrajectoryPoint[] | null>(null);
  const endLabelRef = useRef<Cesium.Entity | null>(null);


  trajectoryHistoryRef.current = trajectoryHistory;

  useEffect(() => {
    if (!cesiumRef.current || viewerRef.current) return;

    const viewer3d = new Cesium.Viewer(cesiumRef.current, globe_options);
    viewerRef.current = viewer3d;
    viewer3d.scene.screenSpaceCameraController.minimumZoomDistance = 100000;
    viewer3d.scene.screenSpaceCameraController.zoomFactor = 2.0;



    startLabelRef.current = viewer3d.entities.add({
      id: "starting_label",
      label: {
        text: 'S',
        font: '80px sans-serif',
        fillColor: Cesium.Color.RED,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, 0),
      },
    })

    heightLineRef.current = viewer3d.entities.add({
      name: "Height Line",
      polyline: {
        width: 3,
        material: Cesium.Color.RED
      }
    })

    trajectoryRef.current = viewer3d.entities.add({
      id: "trajectory",
      name: "Trajectory Line",
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          return trajectoryHistoryRef.current?.map(entry =>
            Cesium.Cartesian3.fromDegrees(entry.longitude, entry.latitude, entry.altitude)
          );
        }, false),
        width: 3,
        material: Cesium.Color.RED
      }
    })

    missileEntityRef.current = viewer3d.entities.add({
      id: "missile",
      show: true,
      polyline: {
        width: 25,
        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.LIME),
      }
    });

    endLabelRef.current = viewer3d.entities.add({
      id: "ending_label",
      show: false,
      label: {
        text: 'X',
        font: '80px sans-serif',
        fillColor: Cesium.Color.RED,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, 0),
      },
    });

    return () => {

      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

    };


  }, [cesiumRef]);

  // useEffect for heightLabel, startingLabel, missileref

  useEffect(() => {

    if (!viewerRef.current || !startLabelRef.current || !heightLineRef.current || !missileEntityRef.current) return;

    const { longitude, latitude, altitude }: TrajectoryPoint = startingValues;

    const newPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
    const heightPosition = Cesium.Cartesian3.fromDegreesArrayHeights([
      longitude, latitude, 0,
      longitude, latitude, altitude
    ]);

    startLabelRef.current.position = new Cesium.ConstantPositionProperty(newPosition);


    if (heightLineRef.current.polyline) heightLineRef.current.polyline.positions = new Cesium.ConstantProperty(heightPosition);


  }, [startingValues]);


  const missileArrowPositionsCallback = useCallback(() => {
    if (!viewerRef.current) {
      return [];
    }
    const scene = viewerRef.current.scene;
    const camera = scene.camera;


    let position: Cesium.Cartesian3;
    let direction: Cesium.Cartesian3;

    if (trajectoryHistory.length >= 2) {
      const lastPoint = trajectoryHistory[trajectoryHistory.length - 1];
      const prevPoint = trajectoryHistory[trajectoryHistory.length - 2];
      position = Cesium.Cartesian3.fromDegrees(lastPoint.longitude, lastPoint.latitude, lastPoint.altitude);

      const p1 = Cesium.Cartesian3.fromDegrees(prevPoint.longitude, prevPoint.latitude, prevPoint.altitude);
      const velocityVector = Cesium.Cartesian3.subtract(position, p1, new Cesium.Cartesian3());
      direction = Cesium.Cartesian3.normalize(velocityVector, new Cesium.Cartesian3());

    } else {

      const { longitude, latitude, altitude, beta, delta } = startingValues;
      position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
      const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      direction = Cesium.Matrix4.multiplyByPointAsVector(transform, new Cesium.Cartesian3(Math.sin(Cesium.Math.toRadians(beta)) * Math.cos(Cesium.Math.toRadians(delta)), Math.cos(Cesium.Math.toRadians(beta)) * Math.cos(Cesium.Math.toRadians(delta)), Math.sin(Cesium.Math.toRadians(delta))), new Cesium.Cartesian3());
      Cesium.Cartesian3.normalize(direction, direction);
    }

    const boundingSphere = new Cesium.BoundingSphere(position, 0);
    const drawingBufferWidth = scene.drawingBufferWidth;
    const drawingBufferHeight = scene.drawingBufferHeight;
    const metersPerPixel = camera.getPixelSize(boundingSphere, drawingBufferWidth, drawingBufferHeight);
    const desiredArrowLengthInPixels = 50;
    const arrowLength = desiredArrowLengthInPixels * metersPerPixel;
    const arrowTip = Cesium.Cartesian3.add(
      position,
      Cesium.Cartesian3.multiplyByScalar(direction, arrowLength, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    );

    return [position, arrowTip];

  }, [trajectoryHistory, startingValues]);

  // Update missile entity based on simulation progress
  useEffect(() => {
    const missile = missileEntityRef.current;
    if (!missile) return;

    const isSimulating = trajectoryHistory.length > 0;
    const isComplete = simulationState === 'completed';

    missile.show = !isComplete;

    if (missile.polyline) {
      missile.polyline.positions = new Cesium.CallbackProperty(missileArrowPositionsCallback, false);
    }

    let position: Cesium.Cartesian3;
    if (isSimulating) {
      const lastPoint = trajectoryHistory[trajectoryHistory.length - 1];
      position = Cesium.Cartesian3.fromDegrees(lastPoint.longitude, lastPoint.latitude, lastPoint.altitude);
    } else {
      const { longitude, latitude, altitude } = startingValues;
      position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
    }
    missile.position = new Cesium.ConstantPositionProperty(position);

  }, [trajectoryHistory, startingValues, simulationState, missileArrowPositionsCallback]);

  // Update trajectory line visibility
  useEffect(() => {
    const trajectory = trajectoryRef.current;
    const endLabel = endLabelRef.current;
    const viewer = viewerRef.current;

    if (!trajectory || !endLabel || !viewer) return;

    const isComplete = simulationState === 'completed';
    const isSimulating = trajectoryHistory.length > 0;

    // Update trajectory line visibility
    trajectory.show = isSimulating;

    // Update end marker
    endLabel.show = isComplete && isSimulating;
    if (isComplete && isSimulating) {
      const lastPoint = trajectoryHistory[trajectoryHistory.length - 1];
      const endPosition = Cesium.Cartesian3.fromDegrees(lastPoint.longitude, lastPoint.latitude, lastPoint.altitude);
      endLabel.position = new Cesium.ConstantPositionProperty(endPosition);
    }


    // Update camera tracking
    if (isComplete) {
      viewer.flyTo(trajectory);
    } else if (isSimulating) {
      viewer.trackedEntity = missileEntityRef.current ?? undefined;

    } else {
      viewer.trackedEntity = startLabelRef.current ?? undefined;
    }

  }, [trajectoryHistory, simulationState]);

  return <div ref={cesiumRef} style={{ width: '100%', height: '100%', padding: 0, overflow: 'hidden' }} />;
}

export default CesiumViewer;