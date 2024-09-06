import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  // Fetch all shifts from the database
  const { data, error } = await supabase.from("shifts").select("*");

  // Handle potential errors during the fetch operation
  if (error) {
    return NextResponse.json(
      {
        message:
          "Error occurred while fetching active shifts. Please reload the page."
      },
      { status: 500 } // 500 Internal Server Error for unexpected issues
    );
  }

  return NextResponse.json(data, { status: 200 });
}

// export const POST = async (request: NextRequest) => {
//   try {
//     const reqBody = await request.json();

//     if (!reqBody) {
//       return NextResponse.json({
//         message: "Please provided a reqBody"
//       });
//     }
//     const { data, error } = await supabase.from("shifts").upsert(reqBody);

//     if (error || !data) {
//       return NextResponse.json({ message: error });
//     }

//     return NextResponse.json(
//       { message: "Shift created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json({ message: error }, { status: 500 });
//   }
// };

// export async function GET(req: Request) {
//   const { data: shifts, error: shiftsError } = await supabase
//     .from("shifts")
//     .select("*");

//   if (shiftsError) {
//     return NextResponse.json(
//       {
//         message: shiftsError
//       },
//       { status: 400 }
//     );
//   }

//   const res = [];
//   for (const shift of shifts) {
//     const { data: volunteersId, error: volunteersIdError } = await supabase
//       .from("volunteer_shifts")
//       .select(
//         `
// volunteer_id,
// volunteers(
// 	name
// )
// `
//       )
//       .eq("shift_id", shift.id);
//     if (volunteersId) {
//       for (const volunteer of volunteersId) {
//         res.push({
//           id: volunteer.volunteer_id,
//           shiftType: shift.shift_name,
//           volunteerName: volunteer.volunteers
//         });
//       }
//     }
//   }

//   return NextResponse.json(
//     {
//       data: res
//     },
//     { status: 200 }
//   );
// }
