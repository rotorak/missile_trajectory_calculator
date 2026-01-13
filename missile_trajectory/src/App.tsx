import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Introduction from './sections/Introduction'
import Architecture from './sections/Architecture'
import Equations from './sections/Equations'
import Simulation from './sections/Simulation'
import { useStorageState} from './ParameterControls';
import { useTrajectoryHistory } from './TrajectoryHistory';
import { type TrajectoryPoint } from './types'
import "./styles/sidebar.css"

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cesiumRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const simulationIdRef = useRef<string | null>(null);
  const [parameterData, setParameterData] = useStorageState('parameterData', { longitude: 0, latitude: 0, beta: 0, delta: 0, altitude: 73152, velocity: 5, time: 0 });
  const { trajectoryHistory, addTrajectoryData, clearTrajectoryHistory } = useTrajectoryHistory();
  const [simulationState, setSimulationState] = useState('pending');

  const navItems = [
    { path: '/', label: 'Introduction', id: 'intro' },
    { path: '/architecture', label: 'Architecture', id: 'architecture' },
    { path: '/equations', label: 'Key Equations', id: 'equations' },
    { path: '/simulation', label: 'Interactive Simulation', id: 'simulation' },
  ];

  //  useEffect clean up on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
  }, []);

  const handleReset = (): void => {

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    clearTrajectoryHistory();
  }

  const parameterSubmit = async () => {
    clearTrajectoryHistory();
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      const initiationResponse = await fetch('/api/trajectory/start', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameterData)
      });
      if (!initiationResponse.ok) {
        throw new Error(`HTTP error! status: ${initiationResponse.status}`);
      }
      const data = await initiationResponse.json();
      const simulationId = data.simulationId;
      simulationIdRef.current = simulationId;
      const evtSource = new EventSource(`/api/trajectory-stream?simulationId=${simulationId}`);
      eventSourceRef.current = evtSource;

      evtSource.onopen = () => { console.log("Successful connection opened.") };
      evtSource.addEventListener("message", (event) => {

        const parsedResponse = JSON.parse(event.data);
        console.log("Received data:", parsedResponse);

        if (parsedResponse.status === 'connected') {
          console.log("Simulation spawned.");
          return;
        }
        if (parsedResponse.status === 'completed') {
          console.log("Simulation completed.");
          setSimulationState(parsedResponse.status);
          evtSource.close();
          eventSourceRef.current = null;
          return;
        }
        addTrajectoryData(parsedResponse as TrajectoryPoint);
      });
      evtSource.addEventListener("error", (error) => {
        console.error("SSE connection error: ", error);
        evtSource.close();
        eventSourceRef.current = null;
      });
    } catch (error) {
      console.error('Error during POST fetch to server: ', error);
    }
  }
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            // X icon when open
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            // Hamburger icon when closed
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`
  fixed lg:static
  inset-y-0 left-0 z-40
  w-64 lg:w-72
  bg-black
  border-r border-gray-700
  transform transition-transform duration-300
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  overflow-y-auto
`}>
        <div className="p-6 lg:p-8">
          <h2 className="text-xl font-semibold mb-6 text-white">Ballistic Trajectory Calculator</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 px-3 text-sm rounded transition-colors ${location.pathname === item.path
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after clicking
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-black text-white">
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/equations" element={<Equations />} />
          <Route path="/simulation" element={
            <Simulation
              cesiumRef={cesiumRef}
              parameterData={parameterData}
              setParameterData={setParameterData}
              parameterSubmit={parameterSubmit}
              handleReset={handleReset}
              trajectoryHistory={trajectoryHistory}
              simulationState={simulationState} />} />
        </Routes>
      </main >
    </div >
  )
}

export default App
