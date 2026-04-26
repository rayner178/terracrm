import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/core/auth/permissions";
import { Role } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

import { withApiAuth } from "@/lib/withApiAuth";

const execAsync = promisify(exec);

export const GET = withApiAuth(async (req: any) => {

  try {
    const scriptPath = path.join(process.cwd(), "scripts", "backup.ts");
    
    // In production environment (Vercel/Railway), running npx tsx might require tsx installed.
    // For robust serverless environments, it's better to run the logic directly.
    // Since the instruction requires running the script:
    await execAsync(`npx tsx ${scriptPath}`); 
    
    return NextResponse.json({ message: "Backup generado exitosamente" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}, ["SUPER_ADMIN"]);
