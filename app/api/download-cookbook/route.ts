import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    console.log("=== DOWNLOAD COOKBOOK ROUTE CALLED ===")

    const { searchParams } = new URL(request.url)
    const cookbookId = searchParams.get("id")

    console.log("Cookbook ID from query:", cookbookId)

    if (!cookbookId) {
      return NextResponse.json({ error: "Cookbook ID required" }, { status: 400 })
    }

    // Map cookbook IDs to file names
    const fileMap: Record<string, string> = {
      "executive-physique": "execute-physique.pdf",
      "lo-carb-hi-results": "lo-carb-hi-results.pdf",
      "vegan-exec": "vegan-exec.pdf",
    }

    const fileName = fileMap[cookbookId]
    console.log("Mapped filename:", fileName)

    if (!fileName) {
      console.log("Cookbook not found for ID:", cookbookId)
      return NextResponse.json({ error: "Cookbook not found" }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), "public", "cookbooks", fileName)
    console.log("Looking for file at:", filePath)

    if (!fs.existsSync(filePath)) {
      console.log("File does not exist at path:", filePath)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)
    console.log("File read successfully, size:", fileBuffer.length)

    // Create a more user-friendly filename
    const downloadFileName = fileName.replace(/-/g, " ").replace(/\.pdf$/, " - ExecFit.pdf")
    console.log("Download filename:", downloadFileName)

    // Enhanced headers for better mobile compatibility
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${downloadFileName}"`,
      "Content-Length": fileBuffer.length.toString(),
      // Additional headers for mobile Safari compatibility
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      // Force download on mobile devices
      "X-Content-Type-Options": "nosniff",
      "Content-Transfer-Encoding": "binary",
    })

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("=== DOWNLOAD ERROR ===")
    console.error("Error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
