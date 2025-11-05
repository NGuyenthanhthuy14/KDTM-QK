// app/(pages)/api/plantDiseases/route.ts
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

type PlantResult = {
  plant_name: string;
  disease_name: string;
  symptoms: string;
  cause: string;
  prevention: string;
  treatment: string;
  image_url: string;
  confidence?: number;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("data") as File | null;
    if (!file) return NextResponse.json({ error: "Không có file" }, { status: 400 });

    // Gửi file sang n8n
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    const payload = new FormData();
    payload.append("data", blob, file.name);

    const response = await fetch("https://thuyxinh.app.n8n.cloud/webhook/plantDiseases-ai", {
      method: "POST",
      body: payload,
    });

    const text = await response.text(); // đọc text để chắc chắn không lỗi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let n8nData: any = {};
    try {
      n8nData = JSON.parse(text);
    } catch {
      console.warn("⚠️ n8n trả về không phải JSON:", text);
      return NextResponse.json({ error: "n8n trả về không phải JSON" }, { status: 500 });
    }

    const props = n8nData.output?.properties;
    if (!props) return NextResponse.json({ error: "Không có properties từ n8n" }, { status: 500 });

    const parsed: PlantResult = {
      plant_name: props.plant_name?.description || "",
      disease_name: props.disease_name?.description || "",
      symptoms: props.symptoms?.description || "",
      cause: props.cause?.description || "",
      prevention: props.prevention?.description || "",
      treatment: props.treatment?.description || "",
      image_url: props.image_url?.description || "",
    };

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("❌ Lỗi khi gọi n8n:", err);
    return NextResponse.json({ error: "Không thể kết nối tới máy chủ AI." }, { status: 500 });
  }
}
