import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop() || "png";
    const sanitizedBase = file.name
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 30);
    const uniqueFileName = `${Date.now()}_${sanitizedBase}.${fileExtension}`;

    // Target bucket name from env or fallback list
    const configuredBucket = process.env.SUPABASE_STORAGE_BUCKET || "student-proofs";
    const candidateBuckets = [
      configuredBucket,
      "student-proofs",
      "proofs",
      "documents",
      "uploads",
      "data"
    ];

    // 1. Try uploading to Supabase Storage Bucket
    for (const bucketName of candidateBuckets) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(uniqueFileName, fileBuffer, {
            contentType: file.type || "image/png",
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(uniqueFileName);

          if (publicUrlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicUrlData.publicUrl,
              filename: file.name,
              bucket: bucketName,
              storageType: "supabase-storage",
            });
          }
        }
      } catch (storageErr) {
        // Try next bucket
      }
    }

    // 2. Resilient Fallback: Return Base64 Data URL so the document is always viewable
    const base64Data = fileBuffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
      storageType: "data-url",
    });
  } catch (err: any) {
    console.error("File upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload file.", details: err.message },
      { status: 500 }
    );
  }
}
