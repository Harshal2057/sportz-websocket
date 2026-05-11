import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

const arjectKey = process.env.ARCJET_KEY;
const arjectMode = process.env.ARCJET_MODE === "DRY_RUN" ? "DRY_RUN" : "LIVE";

if (!arjectKey) throw new Error('Arject key env var is missing');

export const httpArject = arjectKey ?
    arcjet({
        key:arjectKey,
        rules:[
            shield({mode:arjectMode}),
            detectBot({mode:arjectMode , allow: ['CATEGORY:SEARCH_ENGINE' , 'CATEGORY:PREVIEW']}),
            slidingWindow({mode:arjectMode , interval:'10s' , max:50})
        ]
    }) : null;

export const wsArject = arjectKey ?
    arcjet({
        key:arjectKey,
        rules:[
            shield({mode:arjectMode}),
            detectBot({mode:arjectMode , allow: ['CATEGORY:SEARCH_ENGINE' , 'CATEGORY:PREVIEW']}),
            slidingWindow({mode:arjectMode , interval:'2s' , max:5})
        ]
    }) : null;


export function securityMiddleware(){
    return async(req , res , next) => {
        if(!httpArject) return next();

        
        try {
            const decision = await httpArject.protect(req);

            if(decision.isDenied()) {
                if(decision.reason.isRateLimit()) {
                    return res.status(429).json({ error: 'Too many requests.' });
                }

                return res.status(403).json({ error: 'Forbidden.' });
            }
        } catch (e) {
            console.error('Arcjet middleware error', e);
            return res.status(503).json({ error: 'Service Unavailable' });
        }

        next();
    }
}