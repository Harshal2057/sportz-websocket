import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import {prisma} from "../../lib/prisma.js"
import { getMatchStatus } from "../utils/match-status.js";

export const MatchRouter = Router();

const MAX_LIMIT = 100;

MatchRouter.get("/" , async(req , res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);

    if(!parsed.success){
        return res.status(400).json({error: "Invalid Query " , details: JSON.stringify(parsed.error)})
    }

    const limit = Math.min(parsed.data.limit ?? 50 , MAX_LIMIT);

    try {
        const data = await prisma.match.findMany({
            take: limit,
            where: {
                status: parsed.data.status
            }
        })
        res.json({data})
    } catch (error) {
        res.status(500).json({error:"Failed to fetch matches"})
    }
})

MatchRouter.post("/" , async(req , res) => {
    const parsed = createMatchSchema.safeParse(req.body);

    if(!parsed.success){
        return res.status(400).json({error: "Invalid Payload" , details: JSON.stringify(parsed.error)})
    }

    try {
            const match = await prisma.match.create({
                data:{
                    ...parsed.data,
                    startTime:new Date(parsed.data.startTime),
                    endTime: new Date(parsed.data.endTime),
                    homeScore: parsed.data.homeScore ?? 0,
                    awayScore: parsed.data.awayScore ?? 0,
                    status: getMatchStatus(parsed.data.startTime , parsed.data.endTime)
                }                
            })

            res.status(201).json({message: "Match created successfully" , data: match})
    } catch (error) {
         return res.status(400).json({error: "Failed to create match" , details: JSON.stringify(error)})
    }
})