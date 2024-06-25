import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function POST(req: Request) {
  const body = await req.json();
  const { name, dateOfBirth, pronoun, email } = body;

  if (!name || !dateOfBirth || !pronoun || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUserError && existingUserError.details !== '0 rows') {
      throw new Error(existingUserError.message);
    }

    if (existingUser) {
      return NextResponse.json({ error: 'Duplicate email' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, dob: dateOfBirth, pronoun, email }])
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'User registered successfully', data }, { status: 201 });
  } catch (error) {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
