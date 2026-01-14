import math
import argparse
import sys
import json


# beta; /*Bearing angle - Clockwise horizontal angle from north to direction of flight*/
# delta; /*Flight path angle - Angle between missile axis and local horizontal. Angle is positive when missile is climbing.*/
# phi; /*Latitude - Positive in northern hemisphere, negative in southern*/
# theta; /* Longitude - Increase to the east. When firing east, theata = 0, to the west theata = pi/2*/
# x, y, x; /*Coordinate system where center of earth is origin. Z is the polar axis. x and y are in plane of the equator and are 90 degrees apart.
#             The x axis corresponds to the point where thetat = 0. All are positive. */

# gamma; /*Range angle - Vertex at center of earth measured from the point where data is input to the position attained along trajectory.*/
# ax; /*acceleration in x-direction*/
# ay; /*acceleration in y-direction*/
# az; /*acceleration in z-direction*/
# at; /*acceleration along trajectory*/
# vx; /*velocity in the x-direction*/
# vy; /*velocity in the y-direction*/
# vz; /*velocity in the z-direction*/
# vt; /*velocity along the trajectory*/
# ra; /*distance from center of earth to re-entry body, ra = (x^2 + y^2 + z^2)^(1/2)/
# alt; /*distance from surface of earth to re-entry body*/
# r = 6371009; /*radius of earth obtained from WolframAlpha*/
# geo; /*geolocation vector*/
# GRAV; /*acceleration of gravity at a given altitude*/
# g0 = 32.174; /*acceleration of gravity at sea-level in feeet/second^2*/
# U = 0.0000727; /*Earth's rotation in radians per second - (2*pi)/24 * 3600 */
# amu = 4096.84; /* (g0 * r^2)^(1/2) */
# sigma; /*area of spherical triangle*/
# balco; /*ballistic coefficient - Estimated from shape and dimensions*/
# den; /*air density*/
# h; /*altitude above surface of earth, h = ra - r*/
# R; earth's radius, 20,902,890 ft.
# k^2 (k_squared)= g0 * R^2
# u^2 (u_squared) = (0.0000727)^2
# ra missile distance from center of earth
# Vt; velocity trajectory
# H; height of rocket above surface; H = Ra - R
#
# air_res; air resistance at a given altitude, variable depending on atmospheric zone.
# depends on air density, shape of vehicle and velocity. uses constants from guide.
# proprtional to square of velocity

# BALCO; ballistic coefficent -- not givne in pdf, research indicates 0.25 is a reasonable estimate for a missile/roceket, it's dependent on mach values which makes it more complex to figure out

# Initial conditions are: delta, beta, theta, phi, altitutde above earth's surface at burn-out (H)
# Velocity along trajectory at t=0


g0 = 32.174
U = 0.0000727
R_earth_radius = 20902890
k_squared = 32.174 * R_earth_radius**2
u_squared = 0.0000727**2
# Ballistic Coefficient (BALCO = w/(C_D x A))
# Typical range for 1960s ICBM reentry vehicles: 100-5000 lb/ft^2
# Soviet R-16 (1960s): 700-850 lb/ft^2
# Using 700 lb/ft^2 as a reasonable approximation for a 1960s-era ballistic missile
BALCO = 1200.0  # lb/ft^2 - Estimated from historical ICBM data
time_increment = 0.001

def x_pos(ra, theta, phi):
    return (ra) * math.cos(phi) * math.cos(theta)


def y_pos(ra,  theta,  phi):
    return (ra) * math.cos(phi) * math.sin(theta)


def z_pos(ra,  phi):
    return (ra) * math.sin(phi)


def obtain_ra(x,  y,  z):
    return math.sqrt((pow(x, 2) + pow(y, 2) + pow(z, 2)))


def obtain_height(x, y, z):
    return obtain_ra(x, y, z) - R_earth_radius


def velocity_x(vt, theta, phi, delta, beta):
    return vt * ((math.sin(delta) * math.cos(phi) * math.cos(theta))
                 - (math.cos(delta) * math.sin(beta) * math.sin(theta))
                 - (math.cos(delta) * math.cos(beta) * math.sin(phi) * math.cos(theta)))


def velocity_y(vt, theta, phi, delta, beta):
    return vt * ((math.sin(delta) * math.cos(phi) * math.sin(theta))
                 + (math.cos(delta) * math.sin(beta) * math.cos(theta))
                 - (math.cos(delta) * math.cos(beta) * math.sin(phi) * math.sin(theta)))


def velocity_z(vt, phi, delta, beta):
    return vt * ((math.sin(delta) * math.sin(phi))
                 + (math.cos(delta) * math.cos(beta) * math.cos(phi)))


def calculate_initial_velocities(v_initial, delta, beta, theta, phi):

    v_x = velocity_x(v_initial, theta, phi, delta, beta)
    v_y = velocity_y(v_initial, theta, phi, delta, beta)
    v_z = velocity_z(v_initial, phi, delta, beta)

    return v_x, v_y, v_z


def calculate_initial_positions(ra, theta, phi):
    x0 = x_pos(ra, theta, phi)
    y0 = y_pos(ra, theta, phi)
    z0 = z_pos(ra, phi)

    return x0, y0, z0


def air_resistance(path_velocity, directional_velocity, ra):
    air_density = air_density_calculation(ra)
    grav_at_alt = GRAV(ra)
    return (air_density*path_velocity*grav_at_alt*directional_velocity/(2 * BALCO))


def gravity_force_vector(directional_vector, radial_vector):
    if radial_vector < 1.0:
        return 0.0
    return k_squared * directional_vector / (radial_vector ** 3)


def centrifugal_force(directional_velocity_perp):
    return (2*directional_velocity_perp*U)


def coriolis_force(directional_vector):
    return u_squared * directional_vector


def acceleration_x(v_x, v_y, vt, x, ra):

    gravity_vector = gravity_force_vector(x, ra)
    air_res = air_resistance(vt, v_x, ra)
    centrif_f = centrifugal_force(v_y)
    coriolis_f = coriolis_force(x)

    return (- (gravity_vector) - (air_res) + (centrif_f) + (coriolis_f))


def acceleration_y(v_x, v_y, vt, y, ra):
    gravity_vector = gravity_force_vector(y, ra)
    air_res = air_resistance(vt, v_y, ra)
    centrif_f = centrifugal_force(v_x)
    coriolis_f = coriolis_force(y)

    return (- (gravity_vector) - (air_res) - (centrif_f) + (coriolis_f))


def acceleration_z(v_z, vt, z, ra):
    gravity_vector = gravity_force_vector(z, ra)
    air_res = air_resistance(vt, v_z, ra)

    return - (gravity_vector) - air_res


def calculate_acceleration(vt, ra, v_x, v_y, v_z, p_x, p_y, p_z):
    a_x = acceleration_x(v_x, v_y, vt, p_x, ra)
    a_y = acceleration_y(v_x,  v_y, vt, p_y, ra)
    a_z = acceleration_z(v_z, vt, p_z, ra)
    return (a_x, a_y, a_z)


def GRAV(ra):
    grav_at_alt = g0 * (R_earth_radius/ra)**2
    return grav_at_alt


def velocity_update(previous_velocity, acceleration):
    return previous_velocity + acceleration*time_increment
    # increments of milliseconds


def postion_update(previous_position, velocity):
    return previous_position + velocity*time_increment


def get_theta(y, x):
    return math.atan2(y, x)


def get_phi(z, ra):
    return math.atan(z / math.sqrt(ra**2 - z**2))


def get_delta(prev_ra, ra, vt, dt):
    del_ra = (ra - prev_ra) / dt
    if vt == 0 or dt == 0:
        return 0.0

    if abs(del_ra) >= abs(vt):
        return 0.0

    tangential_velocity = math.sqrt(vt**2 - del_ra**2)
    delta = math.atan(del_ra / tangential_velocity)

    return delta


def theta_change(prev_theta, theta):
    return theta - prev_theta


def calculate_gamma(phi0, phi, theta0, theta):
    cos_gamma = (math.sin(phi0) * math.sin(phi) +
                 math.cos(phi0) * math.cos(phi) * math.cos(theta - theta0))

    # avoid rounding errors from multiple trig functions
    cos_gamma = max(-1.0, min(1.0, cos_gamma))

    sin_gamma = math.sqrt(1.0 - cos_gamma**2)
    gamma = math.atan2(sin_gamma, cos_gamma)

    return gamma


def calculate_sigma(phi_1, phi_0, theta_1, theta_0):
    d_theta = theta_1 - theta_0

    cos_phi1 = math.cos(phi_1)
    sin_phi1 = math.sin(phi_1)
    cos_phi = math.cos(phi_0)
    sin_phi = math.sin(phi_0)

    # Calculate gamma first
    cos_gamma = sin_phi1 * sin_phi + cos_phi1 * cos_phi * math.cos(d_theta)
    cos_gamma = max(-1.0, min(1.0, cos_gamma))
    sin_gamma = math.sqrt(1.0 - cos_gamma**2)

    if sin_gamma == 0:
        return 0.0

    num = math.sin(d_theta) * cos_phi1
    den = sin_gamma

    if den == 0:
        return 0.0

    sigma = math.atan2(num, den)
    return sigma


# sigma_1 means current sigma, sigma_0 is previous sigma, etc.
def calculate_beta(beta_0, sigma_1, sigma_0):

    d_sigma = sigma_1 - sigma_0
    beta_1 = beta_0

    if abs(sigma_1) < 1.5688:
        if abs(sigma_1) < 0.01:
            beta_1 = (math.pi * 2) + sigma_1 if beta_0 < (math.pi * 1.5) else (math.pi) - sigma_1
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

    return beta_1


def update_angles(x, y, z):

    phi = get_phi(z, math.sqrt(x**2 + y**2 + z**2))
    theta = get_theta(y, x)

    return (phi, theta)


def air_density_calculation(ra):
    alt = ra - R_earth_radius
    if alt < 0:
        alt = 0.0
    if alt < 40000.0:
        d = alt / 10000
        r3 = -0.37728875E-02
        r2 = 0.52352523E-02
        r1 = -0.31047929E+01
        r0 = 0.89444960E+01
    elif alt < 80000.0:
        d = (alt - 40000) / 10000.0
        r3 = 0.23298604E-05
        r2 = 0.21620268E-03
        r1 = -0.47974207E+00
        r0 = 0.75402419E+01
    elif alt < 160000.0:
        d = (alt - 80000.0) / 10000.0
        r3 = 0.26359811E-04
        r2 = 0.80943560E-02
        r1 = -0.51509227E+00
        r0 = 0.56278474E+01
    elif alt < 175000.0:
        d = (alt - 160000.0) / 10000.0
        r3 = -0.57066660E-04
        r2 = 0.30080000E-03
        r1 = -0.36384173E+00
        r0 = 0.20423758E+01
    elif alt < 270000.0:
        d = (alt - 175000.0) / 10000.0
        r3 = -0.84014648E-03
        r2 = -0.16797257E-02
        r1 = -0.32931657E+00
        r0 = 0.15021266E+01
    elif alt < 290000.0:
        d = (alt - 270000) / 10000.0
        r3 = 0
        r2 = 0.3648009E-03
        r1 = -0.61376240E00
        r0 = -0.25094864E01
    elif alt < 350000.0:
        d = (alt - 290000) / 10000.0
        r3 = 0.17070042E-02
        r2 = -0.16579218E-02
        r1 = -0.63898718E00
        r0 = -0.37292327E+01
    else:
        d = (alt - 350000.0) / 10000.0
        r3 = -0.38550824E-02
        r2 = 0.65901945E-01
        r1 = -0.68705559E+00
        r0 = -0.72589563E+01

    polynom = (((r3 * d) + r2) * d + r1) * d + r0
    r0 = math.exp(polynom) / 100000.0

    den = r0 / GRAV(ra)

    return den


def coordinates_to_angles(lat, long, beta, delta):

    phi = lat * math.pi/180
    theta = long * math.pi/180
    beta = beta * math.pi/180
    delta = delta * math.pi/180

    return (theta, phi, beta, delta)


def angles_to_coordinates(theta, phi, beta, delta):
    
    lat = phi * (180 / math.pi)
    long = theta * (180 / math.pi)
    delta = delta * (180/ math.pi)
    beta = beta * (180 / math.pi)

    return (lat, long, beta, delta)


def calculate_trajectory(delta_0=0, beta_0=0, theta_0=0, phi_0=0, alt_0=792000, v_0=22733):

    total_t = 7.2e+6  # 3 hours in milliseconds
    d_t = 1

    # variable initialization

    ra = alt_0 + R_earth_radius

    (p_x, p_y, p_z) = calculate_initial_positions(ra, theta_0, phi_0)

    (v_x, v_y, v_z) = calculate_initial_velocities(
        v_0, delta_0, beta_0, theta_0, phi_0)

    theta = theta_0
    delta = delta_0
    beta = beta_0
    phi = phi_0
    sigma = 0.0
    vt = v_0
    gamma = 0.0
    time = 0.0

    trajectory_data = [time, p_x, p_y, p_z,
                       theta, delta, phi, beta, sigma, gamma]

    for t in range(1, int(total_t), d_t):
        dt_seconds = (d_t / 1000.0)
        if (ra <= R_earth_radius):
            completion_message = {
                "status": "completed",
                "reason": "impact",
                "time": t,
                "final_position": {
                    "x": p_x,
                    "y": p_y,
                    "z": p_z
                },
                "impact_time_minutes": math.floor(t/60000),
                "impact_time_seconds": (t - math.floor(t/60000)*60000) / 1000
            }
            print(json.dumps(completion_message), flush=True)
            break

        if (t % 1000 == 0):
         # update trajectory data recorded once every second
            lat, long, beta, delta = angles_to_coordinates(theta, phi, beta, delta)
            trajectory_data_point = {
                "time": t,
                "latitude": lat,
                "longitude": long,
                "beta": beta,
                "delta": delta,
                "altitude": (ra - R_earth_radius) * 0.3048,
                "velocity": vt
            }
            print(json.dumps(trajectory_data_point), flush=True)
            trajectory_data.append(
                [t, p_x, p_y, p_z, theta, delta, phi, beta, sigma, gamma])

        phi_0 = phi
        theta_0 = theta
        prev_ra = ra
        sigma_0 = sigma
        (phi, theta) = update_angles(p_x, p_y, p_z)
        ra = math.sqrt(p_x**2 + p_y**2 + p_z**2)
        vt = math.sqrt(v_x**2 + v_y**2 + v_z**2)
        delta = get_delta(prev_ra, ra, vt, (d_t / 1000.0))

        (a_x, a_y, a_z) = calculate_acceleration(
            vt, ra, v_x, v_y, v_z, p_x, p_y, p_z)

        v_x += a_x * dt_seconds
        p_x += v_x * dt_seconds
        v_y += a_y * dt_seconds
        p_y += v_y * dt_seconds
        v_z += a_z * dt_seconds
        p_z += v_z * dt_seconds

        sigma = calculate_sigma(phi, phi_0, theta, theta_0)
        gamma = calculate_gamma(phi_0, phi, theta_0, theta)
        beta = calculate_beta(beta, sigma, sigma_0)

    completion_message = {
        "status": "completed",
        "reason": "time_limit_reached",
        "time": total_t
    }
    print(json.dumps(completion_message), flush=True)

    return trajectory_data


# program receives altitude in meters, velocity in km / second, conversion must occur
# to ft and ft/s respectively

def main():
    parser = argparse.ArgumentParser(
        description='Missile trajectory simulation')
    parser.add_argument('--latitude', type=float, default=0, help='Latitude')
    parser.add_argument('--longitude', type=float, default=0, help='Longitude')
    parser.add_argument('--beta', type=float, default=0, help='Beta')
    parser.add_argument('--delta', type=float, default=0, help='Delta')
    parser.add_argument('--altitude', type=float, help='Altitude')
    parser.add_argument('--velocity', type=float,
                        default=22733, help='Velocity')
    parser.add_argument('--time', type=float, default=0)

    args = parser.parse_args()
    
    altitude = args.altitude * 3.28084
    velocity = args.velocity * 3280.84

    theta, phi, beta, delta = coordinates_to_angles(args.latitude, args.longitude, args.beta, args.delta)

    calculate_trajectory(theta_0=theta, phi_0=phi, beta_0=beta, delta_0=delta, alt_0=altitude, v_0=velocity)


if __name__ == '__main__':
    main()
