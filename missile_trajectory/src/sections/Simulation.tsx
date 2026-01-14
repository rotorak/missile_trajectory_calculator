import CesiumViewer from "../CesiumGlobe";
import React from 'react';
import { ParameterControls } from '../ParameterControls';
import { InfoPanel } from '../InfoPanel';

const controlStyles = `
    flex flex-wrap items-center justify-center gap-4
    [&>*]:flex [&>*]:flex-wrap [&>*]:items-center [&>*]:justify-center [&>*]:gap-4
    [&_input]:text-black [&_input]:bg-white [&_input]:border [&_input]:border-gray-300 [&_input]:rounded [&_input]:px-2 [&_input]:py-1
    [&_button]:px-4 [&_button]:py-1 [&_button]:rounded [&_button]:text-sm [&_button]:font-semibold [&_button]:text-white [&_button]:shadow [&_button]:transition-all
    [&_button]:bg-blue-600 [&_button]:hover:bg-blue-700 [&_button]:active:scale-95
    [&_button+button]:bg-gray-600 [&_button+button]:hover:bg-gray-700
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
        <div className="w-full min-h-[600px] h-full flex flex-col md:flex-row">
            {/* Mobile: Cesium at top (50% height), Desktop: Right side (65% width) */}
            <div className="w-full md:w-[65%] h-[50vh] md:h-full order-1 md:order-2">
                <CesiumViewer
                    cesiumRef={cesiumRef}
                    startingValues={parameterData}
                    trajectoryHistory={trajectoryHistory}
                    simulationState={simulationState}
                />
            </div>
            
            {/* Mobile: Controls panel at bottom (50% height), Desktop: Left side (35% width) */}
            <div className="w-full md:w-[35%] h-[50vh] md:h-full overflow-hidden flex flex-col p-2 md:p-4 order-2 md:order-1">
                <h1 className="text-sm md:text-2xl font-semibold mb-2 md:mb-4 text-white flex-shrink-0">
                    Interactive Simulation
                </h1>
                
                {/* Mobile: Stacked vertically (InfoPanel then ParameterControls), Desktop: Stacked vertically */}
                <div className="flex flex-col md:flex-col gap-2 md:gap-0 flex-1 min-h-0 overflow-hidden">
                    {/* InfoPanel - full width, centered, takes natural height */}
                    <div className="w-full flex-shrink-0 overflow-y-auto text-[0.7rem] md:text-base flex items-center justify-center">
                        <InfoPanel trajectoryHistory={trajectoryHistory} parameterData={parameterData} />
                    </div>
                    
                    {/* ParameterControls - full width, takes remaining space, scrollable */}
                    <div className={`w-full flex-1 min-h-0 overflow-y-auto text-[0.7rem] md:text-base ${controlStyles}`}>
                        <ParameterControls
                            parameterValues={parameterData}
                            onChangeParameterData={setParameterData}
                            parameterSubmit={parameterSubmit}
                            onReset={handleReset}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}