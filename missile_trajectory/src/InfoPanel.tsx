import { type TrajectoryHistory, type TrajectoryPoint, type InfoPanelProp } from "./types";


export const InfoPanel = ({ trajectoryHistory, parameterData }: InfoPanelProp): React.JSX.Element => {

    const formatNumber = (num: number) => {
        num = num / 1000;
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    const formatMach = (num: number) => {
        num = (num * 0.0003048) * 2.91545;
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        })
    }


    const formatTime = (num: number) => {
        num = num / 1000 / 60;
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })

    }


    const currentData: TrajectoryHistory | TrajectoryPoint =
        trajectoryHistory.length == 0 ? parameterData : trajectoryHistory[trajectoryHistory.length - 1];

    return (
        <div>
            <div>
                <div>
                    <p>Time in Flight: {formatTime(currentData.time)} minutes</p>
                </div>
                <div>
                    <p>Current Velocity: {formatNumber(currentData.velocity)} km/s</p>
                    <p>(Mach: {formatMach(currentData.velocity)})</p>
                </div>
                <div>
                    <p>Current Altitude: {formatNumber(currentData.altitude)} km</p>
                </div>
            </div>
        </div>
    )
}