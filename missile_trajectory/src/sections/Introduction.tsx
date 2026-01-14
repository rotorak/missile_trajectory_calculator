import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import fortranMap from '../img/c1.png';

export default function Introduction() {
    return (
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
            <h1 className="text-3xl lg:text-4xl font-semibold mb-6 text-white">
                Introduction
            </h1>
            <div className="prose prose-invert max-w-none text-base lg:text-lg leading-relaxed text-gray-200 space-y-4">
                <p>
                    This project converts a 1962 FORTRAN II program for calculating ballistic missile trajectories (published for the IBM 1410 punch-card system) into a modern full-stack web application. The simulation engine has been modernized to Python 3.11 and runs within an Express.js backend using an event-driven architecture with Node.js EventEmitterfor decoupled communication.
                </p>
                <br />
                The paper: <a className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600' href="/missile_defense.pdf" target="_blank" rel="noopener noreferrer">Link</a>
                <p>
                    Simulation data is streamed to the front-end in one-second intervals via Server-SentEvents (SSE) and displayed in a 3D global visualization using Cesium.js. The data flow is:
                    <p>
                        <br />
                        User inputs → REST API → Python simulation → Express.js → SSE stream → React →Cesium visualization.
                    </p>
                </p>
                <p>
                    Each simulation generates a unique simulationId, and the backend uses EventEmitter with unique event names per simulation to ensure data isolation when multiple simulations run concurrently. SE was chosen over WebSockets due to deployment platform constraints.
                </p>
                <p>
                    The logical flow for FORTRAN II would be unfamiliar to most users of modern C-syntax based languages, as the typical conditional expressions aren't utilized; instead, conditionals reference specific GOTO line entries in order to facilitate execution which makes tracking the logic-flow of a program somewhat more difficult to follow.
                </p>
                <img
                    src={fortranMap}
                    alt=""
                    className="mx-auto max-w-full h-auto"
                />
                <p>Becomes:</p>
                <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{
                        backgroundColor: '#111827', // bg-gray-900 equivalent
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                >
                    {`def calculate_beta(beta_0, sigma_1, sigma_0):

    d_sigma = sigma_1 - sigma_0
    beta_1 = beta_0

    if abs(sigma_1) < 1.5688:
        if abs(sigma_1) < 0.01:
            beta_1 = ((math.pi * 2) + sigma_1 
                      if beta_0 < (math.pi * 1.5) 
                      else (math.pi) - sigma_1)
        else:
            if abs(d_sigma) < 1e-10:
                beta_1 = beta_0 + 0.001
            elif d_sigma < 0:
                beta_1 = beta_0 - abs(d_sigma)
            else:
                beta_1 = beta_0 + abs(d_sigma)
    elif abs(sigma_1) == 1.5688:
        beta_1 = sigma_1 if beta_0 < (math.pi / 2) else (math.pi) - sigma_1

    else:
        if beta_0 < (math.pi / 2):
            beta_1 = sigma_1
        else:
            beta_1 = (math.pi) - sigma_1

    while beta_1 < 0:
        beta_1 += 2 * math.pi
    while beta_1 >= 2 * math.pi:
        beta_1 -= 2 * math.pi

    return beta_1`}
                </SyntaxHighlighter>
            </div>

            <p>
                The process of conversion required eliminating all GOTO statements, converting three-way structured arithmetic IF statements into if/elif/else conditional structuring. Label-based loops were also replaced with while and for loops.
            </p>
        </div>
    );
}