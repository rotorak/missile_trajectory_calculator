import { MathJaxContext, MathJax } from 'better-react-mathjax';
import diagram from '../img/img_1.jpg';

const equation1 = String.raw`\(V_x = V_0 (\sin\delta \cos\phi \cos\theta - \cos\delta \sin\beta \sin\theta - \cos\delta \sin\beta \sin\phi \cos\theta) \)`;
const equation2 = String.raw`\(V_y = V_0 (\sin\delta \cos\phi \sin\theta - \cos\delta \sin\beta \cos\theta - \cos\delta \cos\beta \sin\phi \sin \theta) \)`;
const equation3 = String.raw`\(V_z = V_0 (\sin\delta \sin\phi + \cos\delta \cos\beta \cos\phi) \)`;
const equation4 = String.raw`\(A_x = -\frac{\mu^2X}{{R_a}^3}-\frac{\rho V_tgV_x}{2\left(\frac{W}{C_DA}\right)}+2V_yU+U^2X \)`;
const equation5 = String.raw`\(A_y=-\frac{\mu^2Y}{{R_a}^3}-\frac{\rho V_tgV_y}{2\left(\frac{W}{C_DA}\right)}+2V_xU+U^2Y \)`;
const equation6 = String.raw`\(A_z=-\frac{\mu^2Z}{{R_a}^3}-\frac{\rho V_tgV_z}{2\left(\frac{W}{C_DA}\right)} \)`;
const equation7 = String.raw`\(x = R_a \cos\phi \cos\theta \)`;
const equation8 = String.raw`\(y = R_a \cos\phi \sin\theta \)`;
const equation9 = String.raw`\(z = R_a \sin\phi \)`;
const equation10 = String.raw`\(\theta = \operatorname{arctan2}(y, x) \)`;
const equation11 = String.raw`\(\phi = \arctan(\frac{z}{\sqrt{{R_a}^2 - z^2}}) \)`;
const equation12 = String.raw`\(\theta = \arctan\left(\frac{Y}{X}\right) \)`;
const equation13 = String.raw`\(\phi = \arctan\left(\frac{z}{R_a}\right) \)`;
const equation14 = String.raw`\(\delta = \arctan\left(\frac{\Delta R_a}{\Delta t \cdot V_t}\right) \)`;
const equation15 = String.raw`\( \text{position}_{x,y,z} = V_{x,y,z} \cdot (1 \text{ millisecond}) \)`;
const equation16 = String.raw`\( \text{velocity}_{x,y,z} = A_{x,y,z} \cdot (1 \text{ millisecond}) \)`;

export default function Equations() {
    return (
        <MathJaxContext>
            <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
                <h1 className="text-3xl lg:text-4xl font-semibold mb-6 text-white">
                    Key Equations and Derivations
                </h1>
                <div className="prose prose-invert max-w-none text-base lg:text-lg leading-relaxed text-gray-200 space-y-4">
                    <img
                        src={diagram}
                        alt=""
                        className="mx-auto max-w-full h-auto"
                    />
                    <p>FIGURE 1: A representation of the rocket positioning with respect to the Earth and x,y,z axes and all relevant angles.</p>

                    <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                        Symbols
                    </h3>
                    <p>
                        β  - Bearing angle - Clockwise horizontal angle from north to direction of flight
                    </p>
                    <p>
                        δ -  Flight path angle - Angle between missile axis and local horizontal. Angle is positive when missile is climbing.
                    </p>
                    <p>
                        φ -  Latitude - Positive in northern hemisphere, negative in southern
                    </p>
                    <p>
                        θ - Longitude - Increase to the east. When firing east, theta = 0, to the west theta = π/2
                    </p>
                    <p>
                        γ - Range angle - Vertex at center of earth measured from the point where data is input to the position attained along trajectory.
                    </p>
                    <p>
                        X, Y, Z - Coordinate system where center of earth is origin. z is the polar axis. x and y are in plane of the equator and are 90 degrees apart. The x axis corresponds to the point where theta = 0. All are positive.
                    </p>
                    <p>
                        <MathJax inline>{"\\( A_x, A_y, A_z\\)"}</MathJax> - acceleration in x, y, and z-directions.
                    </p>
                    <p>
                        <MathJax inline>{"\\( V_x, V_y, V_z\\)"}</MathJax> velocities in x, y, and z-directions.
                    </p>
                    <p>
                        <MathJax inline>{"\\( V_t\\)"}</MathJax> - velocity along missile trajectory
                    </p>
                    <p>
                        <MathJax inline>{"\\( R_a\\)"}</MathJax>- distance from center of earth to re-entry body, <MathJax inline>{"\\( R_a = \\sqrt{x^2+y^2+z^2}\\)"}</MathJax>
                    </p>
                    <p>
                        g - strength of gravity at a given altitude
                    </p>
                    <p>
                        g<sub>0</sub> - strength of gravity at sea-level 32.174 ft/sec<sup>2</sup>
                    </p>
                    <p>
                        R - radius of earth; 20,902,890 ft
                    </p>
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                        Coordinate Transformations
                    </h2>
                    <p>
                        Spherical to Cartesian:
                        <MathJax>
                            {equation7}
                        </MathJax>
                        <MathJax>
                            {equation8}
                        </MathJax>
                        <MathJax>
                            {equation9}
                        </MathJax>
                    </p>
                    <p>
                        Cartesian to Spherical:
                        <MathJax>
                            {equation10}
                        </MathJax>
                        <MathJax>
                            {equation11}
                        </MathJax>
                    </p>
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                        Velocity
                    </h2>
                    <p>
                        The derivation of the missile dynamics is written in full within the paper, but to provide a brief summary:
                    </p>
                    <p>
                        The initial velocities within the x, y, and z directions are determined by the following formula, which converts spherical coordinate velocity into cartesian coordinates:
                    </p>
                    <MathJax>
                        {equation1}
                    </MathJax>
                    <MathJax>
                        {equation2}
                    </MathJax>
                    <MathJax>
                        {equation3}
                    </MathJax>
                    <p>
                        The acceleration in the x, y, and z direction is determined by the four forces acting on the ballistic missile, which are air resistance, variation of gravitational, centrifugal, and the Coriolis force.
                    </p>
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                        Forces
                    </h2>
                    <p>
                        <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                            1) Gravitational Force: <MathJax inline>{"\\( -\\frac{\\mu^2X}{{R_a}^3} \\)"}</MathJax>
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">  <li>Strength based on inverse square law with respect to altitude variation</li>
                            <li><MathJax inline>{"\\(\mu^2 = g_0 \\times R \\text{ (gravitational parameter)} \\)"}</MathJax></li></ul>
                    </p>
                    <p>
                        <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                            2) Air Resistance: <MathJax inline>{"\\( -\\frac{\\rho V_t g V_x}{2 \\times (\\frac{W}{C_DA})} \\)"}</MathJax>
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Proportional to air density (ρ), velocity squared, and ballistic coefficient</li>
                            <li>Opposes motion, dependent on air density <MathJax inline>{"\\(\\rho\\)"}</MathJax>, and velocity.</li>
                            <li><MathJax inline>{"\\( (\\frac{W}{C_DA}) \\)"}</MathJax> is the ballistic coefficient, estimated to be 1200 lb/ft<sup>2</sup>.</li>
                            <li>The ballistic coefficient for the missile was estimated from historical data, as it was not provided in the original paper written in 1962. Specifically, a coefficent based on data from Soviet missiles of the era was used and validated against historical ICBM specifications automated by Google Gemini, giving evidence that the estimation of 1200.0 lb/ft<sup>2</sup> is reasonable.</li>
                            <li>The original program offered two means for obtaining air pressure variation with respect to altitude: an algorithm that generates a polynomial and the possibility of loading in a tape deck that had atmospheric data that could be referenced. The polynomial method is implemented in the air_density_calculation() function in missile.py, which translates the FORTRAN algorithm logic into Python using piecewise polynomial functions for different altitude ranges.</li>
                        </ul>
                    </p>
                    <p>
                        <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                            3)  Coriolis Effect: <MathJax inline>{"\\(2V_xU\\)"}</MathJax> (x-direction), <MathJax inline>{"\\(2V_yU\\)"}</MathJax> (y-direction)
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Earth's rotation effect on moving objects</li>
                            <li><MathJax inline>{"\\( U = \\frac{2\\pi}{24 \\cdot 3600} \\text{ radians/sec} \\)"}</MathJax> (Earth's angular velocity)</li>
                        </ul>
                    </p>
                    <p>
                        <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                            4) Centrifugal Force: <MathJax inline>{"\\(U^2X\\)"}</MathJax>, <MathJax inline>{"\\(U^2Y\\)"}</MathJax>
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Outward force due to Earth's rotation</li>
                            <li>Affects objects in rotating reference frame</li>
                        </ul>
                        <br />
                    </p>
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                        Acceleration
                    </h2>
                    <p>
                        The four forces acting on the ballistic missile outlined above give the following equations of acceleration:
                    </p>
                    <MathJax>
                        {equation4}
                    </MathJax>
                    <MathJax>
                        {equation5}
                    </MathJax>
                    <MathJax>
                        {equation6}
                    </MathJax>
                    <p>
                        Where:
                    </p>
                    <p>
                        <MathJax inline>{"\\( U = \\frac{2\\pi}{24 \\cdot 3600} \\text{ radians/sec} \\)"}</MathJax>
                    </p>
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                        Angle Calculations
                    </h2>
                    <p>
                        Each millisecond iteration within the main time for-loop updates all position, velocity, acceleration, and angles. Basic trigonometric relations are used to update the following angles:
                    </p>
                    <MathJax>
                        {equation12}
                    </MathJax>
                    <MathJax>
                        {equation13}
                    </MathJax>
                    <p>
                        <MathJax inline>{equation14}</MathJax> where <MathJax inline>{"\\(\\frac{\\Delta R_a}{\\Delta t}\\)"}</MathJax> is the average change in velocity.
                    </p>
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                        Bearing Angle Calculations
                    </h2>
                    <p>
                        Calculating β is the more convoluted calculation performed and is explained in detail within the original paper. To summarize, the change in the angles of θ, β are projected onto a spherical triangle, with a third auxiliary angle sigma σ added as the third angle of the triangle. The change of length that accompanies the change of angles is represented as gamma γ, which represents the length of the length of the arc of the trajectory under conditions where the Earth isn’t rotating. Any errors introduced under this assumption are small due to the time iterations being in milliseconds. Using trigonometric derivations, the final derivation of β is determined to be:
                    </p>
                    <p>β = σ <br/>(if previous β was between 0 and 90°)</p>
                    <p>β = π - σ  <br/>(if previous β was between 0 and 90°)</p>
                    <p>β = 2π + σ   <br/>(if previous β was over 270°)</p>
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                        Current Position and Velocity Calculation 
                    </h2>
                    <p>Finally, the program utilizes the following integration equations for velocity and position to update the position and velocity vectors within the x,y,z coordinates during each millisecond iteration:</p>
                    <MathJax>
                        {equation15}
                    </MathJax>
                    <MathJax>
                        {equation16}
                    </MathJax>
                </div>
            </div>
        </MathJaxContext>
    );
}