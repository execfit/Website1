import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Setup Trainer Tables</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        button { background: #0070f3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; margin: 10px 0; }
        button:hover { background: #0051cc; }
        .result { margin-top: 20px; padding: 15px; border-radius: 6px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>Setup Trainer System Tables</h1>
      <p>This will create the necessary tables for the trainer invitation system.</p>
      
      <button onclick="setupTables()">Create Trainer Tables</button>
      <div id="result"></div>
      
      <script>
        async function setupTables() {
          const button = document.querySelector('button');
          const result = document.getElementById('result');
          
          button.disabled = true;
          button.textContent = 'Creating tables...';
          result.innerHTML = '';
          
          try {
            const response = await fetch('/api/setup-trainer-tables', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
              result.className = 'result success';
              result.innerHTML = '<strong>Success!</strong><br>' + data.message;
              if (data.details) {
                result.innerHTML += '<br><br><strong>Tables Created:</strong><br>' + data.details.join('<br>');
              }
            } else {
              result.className = 'result error';
              result.innerHTML = '<strong>Error:</strong><br>' + data.error;
            }
          } catch (error) {
            result.className = 'result error';
            result.innerHTML = '<strong>Error:</strong><br>' + error.message;
          }
          
          button.disabled = false;
          button.textContent = 'Create Trainer Tables';
        }
      </script>
    </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
}

export async function POST() {
  try {
    console.log("🚀 Setting up trainer system tables...")

    // Create trainer_invitations table
    const { error: invitationsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS trainer_invitations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          temporary_password VARCHAR(255) NOT NULL,
          trainer_name VARCHAR(255) NOT NULL,
          specialty VARCHAR(255),
          invited_by VARCHAR(255) DEFAULT 'admin',
          is_used BOOLEAN DEFAULT false,
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          used_at TIMESTAMP WITH TIME ZONE
        );
      `,
    })

    if (invitationsError) {
      console.error("Error creating trainer_invitations table:", invitationsError)
      // Try alternative approach
      const { error: altError } = await supabase.from("trainer_invitations").select("id").limit(1)

      if (altError && altError.code === "42P01") {
        return NextResponse.json({
          success: false,
          error: "Please create the trainer_invitations table manually in Supabase SQL Editor",
          sql: `
CREATE TABLE trainer_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  temporary_password VARCHAR(255) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255),
  invited_by VARCHAR(255) DEFAULT 'admin',
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE trainer_invitations ENABLE ROW LEVEL SECURITY;

-- Allow public read access for now (we'll restrict this later)
CREATE POLICY "allow_all_trainer_invitations" ON trainer_invitations FOR ALL USING (true);
          `,
        })
      }
    }

    // Create trainers table (extended from coaches)
    const { error: trainersError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS trainers (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          specialty VARCHAR(255),
          bio TEXT,
          hourly_rate DECIMAL(10,2),
          session_rate DECIMAL(10,2),
          image VARCHAR(255),
          gallery JSONB DEFAULT '[]',
          certifications JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          profile_completed BOOLEAN DEFAULT false,
          auth_user_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create clients table
    const { error: clientsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          apartment_building VARCHAR(255),
          trainer_id VARCHAR(50) REFERENCES trainers(id),
          sessions_remaining INTEGER DEFAULT 0,
          total_sessions_purchased INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Trainer system tables created successfully!",
      details: [
        "✅ trainer_invitations - For managing trainer invitations",
        "✅ trainers - Extended trainer profiles",
        "✅ clients - Client session management",
      ],
    })
  } catch (error) {
    console.error("💥 Error setting up trainer tables:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
