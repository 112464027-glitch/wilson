# 🐾 小白的飲食叮嚀

可愛小白狗 AI 飲食追蹤 App，使用 Gemini 分析食物營養，資料存到 Supabase 雲端。

## 技術架構

- **Frontend + API Routes**：Next.js 14 on Vercel
- **AI 分析**：Google Gemini 1.5 Flash（Key 藏在伺服器，不外洩）
- **雲端資料庫**：Supabase（跨裝置同步飲食紀錄）

---

## 部署步驟

### 1. Supabase — 建立資料表

在你的 Supabase 專案，進入 **SQL Editor**，執行：

```sql
create table diet_records (
  id           bigserial primary key,
  created_at   timestamptz default now(),
  meal         text,
  foods        text[],
  calories     numeric,
  protein      numeric,
  carbs        numeric,
  fat          numeric,
  fiber        numeric,
  score        int,
  score_reason text,
  advice       text[],
  supplement   text,
  img_url      text
);
```

### 2. 取得 Supabase 金鑰

進入 Supabase 專案 → **Settings → API**：
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. 取得 Gemini API Key

前往 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) 建立 Key。

### 4. 推上 GitHub

```bash
git init
git add .
git commit -m "🐾 小白的飲食叮嚀"
git remote add origin https://github.com/112464027-glitch/shiro-diet-tracker.git
git branch -M main
git push -u origin main
```

### 5. 部署到 Vercel

1. 到 [vercel.com](https://vercel.com) → **Add New Project**
2. 選擇你的 `shiro-diet-tracker` repo
3. 在 **Environment Variables** 加入：

| 變數名稱 | 值 |
|---|---|
| `GEMINI_API_KEY` | 你的 Gemini API Key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

4. 按 **Deploy** 🚀

---

## 本機開發

```bash
npm install
cp .env.local.example .env.local
# 填入 .env.local 的三個金鑰
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 專案結構

```
shiro-diet-tracker/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts   # Gemini API（Key 在伺服器端）
│   │   └── records/route.ts   # Supabase 讀寫
│   ├── layout.tsx
│   └── page.tsx               # 主前端
├── lib/
│   └── supabase.ts            # Supabase client
├── .env.local.example
├── .gitignore                 # .env.local 不會上傳！
└── README.md
```
