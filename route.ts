import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/records — 取得所有紀錄（最新30筆）
export async function GET() {
  const { data, error } = await supabase
    .from('diet_records')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

// POST /api/records — 新增一筆紀錄
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('diet_records')
      .insert([{
        meal:         body.meal,
        foods:        body.foods,
        calories:     body.calories,
        protein:      body.protein,
        carbs:        body.carbs,
        fat:          body.fat,
        fiber:        body.fiber,
        score:        body.score,
        score_reason: body.scoreReason,
        advice:       body.advice,
        supplement:   body.supplement || null,
        img_url:      body.imgUrl || null,
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: '儲存失敗' }, { status: 500 })
  }
}
