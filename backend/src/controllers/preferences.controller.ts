import type {Request , Response} from "express";
import {getAuthUser} from "../types/auth";
import {updatePreferencesSchema} from "../validators/preferences.validator";
import {getPreferencesByUserId, upsertPreferences}  from "../services/preferences.service";



function serializePreferences(userId: string, prefs:any){

    if(!prefs) return null;

    return {
        ...prefs,
        id:prefs.id.toString(),
        userId: userId,
    };
}


export async function  getPreferences(req: Request, res:Response){
    
    const {userId} = getAuthUser(req);

    const prefs = await getPreferencesByUserId(BigInt(userId));

    return res.status(200).json({success: true,
        
        data:{
            preferences: serializePreferences(userId, prefs),
        }
    })
}

export async function updatePreferences(req: Request, res: Response) {

    const {userId} = getAuthUser(req);

    const parsed = updatePreferencesSchema.safeParse(req.body);

        if (!parsed.success) {

            return res.status(400).json({

            success: false,

            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
            });
        }

        const prefs = await upsertPreferences(BigInt(userId), parsed.data);

        return res.status(200).json({ success: true, message: "Preferences updated",

                data: {
                     preferences: serializePreferences(userId, prefs),
                },
  });
}