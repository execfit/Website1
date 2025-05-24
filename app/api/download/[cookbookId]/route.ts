import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { cookbookId: string } }) {
  try {
    const { cookbookId } = params

    // Map cookbook IDs to file names
    const fileMap: Record<string, string> = {
      "executive-physique": "execute-physique.pdf",
      "lo-carb-hi-results": "lo-carb-hi-results.pdf",
      "vegan-exec": "vegan-exec.pdf",
    }

    const fileName = fileMap[cookbookId]
    if (!fileName) {
      return NextResponse.json({ error: "Cookbook not found" }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), "public", "cookbooks", fileName)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    // Create a more user-friendly filename
    const downloadFileName = fileName.replace(/-/g, " ").replace(/\.pdf$/, " - ExecFit.pdf")

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadFileName}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
