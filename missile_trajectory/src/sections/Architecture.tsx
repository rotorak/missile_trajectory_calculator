export default function Architecture() {
    return (
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
            <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
                <h1 className="text-3xl lg:text-4xl font-semibold mb-6 text-white">
                    Program Architecture
                </h1>
                <div className="prose prose-invert max-w-none text-base lg:text-lg leading-relaxed text-gray-200 space-y-4">
                        <p>The user provides initial altitude, latitude, longitude, and velocity of the ballistic missile at burn-out - that is, after its main engine ceases to operate and the missile's trajectory is guided by basic physics, specifically: the forces of air resistance, which is determined by air pressure (which varies with missile altitude), the Coriolis effect, as well as centrifugal forces.</p>
                        <p>The front-end is built on React and Cesium. The user can modify the starting point by adjusting the altitude, latitude, longitude, and velocity of the missile at burn-out. This modifies the starting state of the simulation which is saved in a React state. The altitude and velocity parameters were restricted to realistic ICBM burn-out conditions: altitude 30-150 km, velocity 6-8 km/s, to prevent numerical instability from extreme conditions.</p>
                        <p>Once the user begins the simulation, the front-end communicates with the back-end via RESTful API design with a POST /api/trajectory/start endpoint. Once the initial trajectory data reaches the back-end, the next step is the creation of a unique simulation ID and event name which is used as a key keep track of the trajectory data on the front-end as well as spawn a unique Python instance by Node.js. All simulation data is sent from the simulation, to the EventEmitter, and to the front-end in JSON format.</p>
                        <p>Once a unique simulation Id is created, the back-end then creates an EventEmitter in order to stream data to the front-end that the generated Python process calculates during a given simulation run. The state lifecycle is updated from events received from the EventEmitter, and all necessary clean-up functions are initiated once a simulation completes, runs into an error, or is  manually reset.</p>
                        <p>The simulation runs within a for-loop with step-increments of milliseconds which differs from the original program in the paper, which ran in increments of 1 second above a certain altitude and then increments of 0.1 seconds once air resistance became a more significant factor on the total forces acting on the missile. Being that computation speeds have somewhat improved since 1962, the
                        Once the simulation concludes, the python process terminates and clean-up occurs.</p>
                </div>
            </div>
        </div>
    );
}