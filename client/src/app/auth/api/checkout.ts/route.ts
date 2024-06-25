import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function POST(req: Request) {
  const body = await req.json();
  const { email, shiftId } = body;

  if (!email || !shiftId) {
    return NextResponse.json({ error: 'Email and Shift ID are required' }, { status: 400 });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('sid')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: userError?.message || 'User not found' }, { status: 500 });
    }

    const userId = userData.sid;

    const { data: volunteerData, error: volunteerError } = await supabase
      .from('volunteers')
      .select('vid')
      .eq('user_id', userId)
      .single();

    if (volunteerError || !volunteerData) {
      return NextResponse.json({ error: volunteerError?.message || 'Volunteer not found' }, { status: 500 });
    }

    const volunteerId = volunteerData.vid;

    const { data, error } = await supabase
      .from('volunteer_shifts')
      .update({
        status: 'checked out',
        checked_out_at: new Date().toISOString(),
      })
      .eq('volunteer_id', volunteerId)
      .eq('shift_id', shiftId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Volunteer checked out successfully', data });
  } catch (error) {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
