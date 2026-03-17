import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType, supplement } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: '缺少圖片' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `你是一個可愛的小白狗，同時也是專業的運動營養師，幫助健身人士分析飲食。
分析圖片中的食物，並結合使用者補充的文字說明（如看不到的食材、份量、調味等），以繁體中文回覆。
只輸出純 JSON，不加 markdown 或其他文字：
{
  "foods": ["食物1","食物2"],
  "calories": 數字,
  "protein": 數字,
  "carbs": 數字,
  "fat": 數字,
  "fiber": 數字,
  "score": 1到10整數,
  "scoreReason": "一句話",
  "advice": ["建議1","建議2","建議3"]
}
使用者補充說明非常重要，務必納入計算（如蛋白粉、醬汁、飲料、實際份量等）。
score 7以上是好，4-6中等，3以下不好。advice 請用活潑親切口氣，帶入「小白建議你...」風格。
圖片不是食物時 foods 填 ["無法辨識"]，其他填 0。
${supplement ? `使用者補充說明：${supplement}` : ''}`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64,
        },
      },
    ])

    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Gemini error:', err)
    return NextResponse.json({ error: '分析失敗，請重試' }, { status: 500 })
  }
}
