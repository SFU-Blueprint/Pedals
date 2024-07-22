import { NextResponse } from "next/server";
import {createClient} from "@supabase/supabase-js";

const minLength = 8;
const maxLength = 15;

const hasNumbers = (string: string) => /\d/.test(string);
const hasLetters = (string: string) => /[a-zA-Z]/.test(string);

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    const body = await req.json();
    const { currCode, newCode } = body;

    if (!currCode || !newCode) {
        return NextResponse.json(
            { error: "Current and New Code are required" },
            { status: 400 }
        );
    }

    if (currCode === newCode) {
        return NextResponse.json(
            { error: "Current and New Code cannot be the same" },
            { status: 400 }
        );
    }

    if (newCode.length < minLength
        || newCode.length > maxLength
        || !(hasLetters(newCode) && hasNumbers(newCode))) {
        return NextResponse.json(
            { error: "New Code must be between 8 and 15 characters long, and contain at least one letter and one number" },
            { status: 400 }
        );
    }


    if (supabaseUrl && key) {
        const supabase = createClient(supabaseUrl, key);
        try {
            const { data: codeData, error: codeError } = await supabase.
            from("access_codes").
            select("access_code").
            eq("access_code", currCode).
            single();

            if (codeError || !codeData) {
                return NextResponse.json(
                    { error: codeError?.message || "Code not found" },
                    { status: 500 }
                );
            }

            const { data, error } = await supabase.
            from("access_codes").
            update({
                access_code: newCode
            }).
            eq("access_code", currCode);


            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({
                message: "Code changed successfully",
                data
            }, { status: 200 });

        } catch (error) {
            let errorMessage = "An unknown error occurred";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }
    }

    return NextResponse.json(
        { error: "Supabase URL and Key are required" },
        { status: 500 }
    );
}