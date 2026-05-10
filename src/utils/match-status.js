import { matchStatusEnum } from "../validation/matches.js";

export function getMatchStatus(startTime , endtime , now = new Date()) {
    const start = new Date(startTime);
    const end = new Date(endtime)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) ) {
        return null;
    }

    if (now < start) {
        return matchStatusEnum.SCHEDULED;
    }

    if (now >= end) {
        return matchStatusEnum.FINISHED
    }

    return matchStatusEnum.LIVE

}