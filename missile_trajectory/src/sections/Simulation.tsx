import CesiumViewer from "../CesiumGlobe";
import React from 'react';
import { ParameterControls } from '../ParameterControls';
import { InfoPanel } from '../InfoPanel';

const controlStyles = `
    flex flex-wrap items-center justify-center gap-4
    [&>*]:flex [&>*]:flex-wrap [&>*]:items-center [&>*]:justify-center [&>*]:gap-4
    [&_input]:text-black [&_input]:bg-white [&_input]:border [&_input]:border-gray-300 [&_input]:rounded [&_input]:px-2 [&_input]:py-1
    [&_button]:px-4 [&_button]:py-1 [&_button]:rounded [&_button]:text-sm [&_button]:font-semibold [&_button]:text-white [&_button]:shadow [&_button]:transition-all
    [&_button]:bg-blue-600 [&_button:hover]:bg-blue-700 [&_button:active]:scale-95
    [&_button+button]:bg-gray-600 [&_button+button:hover]:bg-gray-700
`;


interface SimulationProps {
    cesiumRef: React.RefObject<HTMLDivElement | null>;
    parameterData: any;
    setParameterData: any;
    parameterSubmit: () => void;
    handleReset: () => void;
    trajectoryHistory: any[];
    simulationState: string;
}

export default function Simulation({
    cesiumRef,
    parameterData,
    setParameterData,
    parameterSubmit,
    handleReset,
    trajectoryHistory,
    simulationState,
}: SimulationProps) {
    return (
        <div className="w-full min-h-[600px] h-full flex">
            <div className="w-[35%] h-full overflow-y-auto p-4">
                <h1 className="text-2xl font-semibold mb-4 text-white">
                    Interactive Simulation
                </h1>
                <InfoPanel trajectoryHistory={trajectoryHistory} parameterData={parameterData} />
                <div className={controlStyles}>
                    <ParameterControls
                        parameterValues={parameterData}
                        onChangeParameterData={setParameterData}
                        parameterSubmit={parameterSubmit}
                        onReset={handleReset}
                    />
                </div>
            </div>
            <div className="w-[65%] h-full">
                <CesiumViewer
                    cesiumRef={cesiumRef}
                    startingValues={parameterData}
                    trajectoryHistory={trajectoryHistory}
                    simulationState={simulationState}
                />
            </div>
        </div>

    );
}