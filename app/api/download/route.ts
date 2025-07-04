import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { cookbookId: string } }) {
  try {
    console.log("=== DOWNLOAD ROUTE CALLED ===")
    console.log("Cookbook ID:", params.cookbookId)

    const { cookbookId } = params

    // Map cookbook IDs to file names
    const fileMap: Record<string, string> = {
      "executive-physique": "ExecPerformanceCookbook.pdf",
      "lo-carb-hi-results": "Lo-Carb Cookbook.pdf",
      "vegan-exec": "VeganExec Cookbook.pdf",
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

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadFileName}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("=== DOWNLOAD ERROR ===")
    console.error("Error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
