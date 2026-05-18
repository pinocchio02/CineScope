# 🎬 CineScope

![React](https://img.shields.io/badge/Frontend-React_TypeScript-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python-009688?style=for-the-badge&logo=fastapi)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel)

**CineScope** is an end-to-end movie recommendation engine that combines a sleek, modern React frontend with a powerful Python-based machine learning backend. Designed with a cinema-first "Dark & Amber" aesthetic, it allows users to discover movies through personalized recommendations, advanced filtering, and smart search.

---

## ✨ Features

* **🤖 AI-Powered Recommendations:** Get "More like this" suggestions based on content similarity and genre analysis.
* **🔍 Smart Search:** Real-time search with instant dropdown suggestions.
* **🎛️ Advanced Filtering:** Filter movies by **Genre**, **Release Year**, and **Minimum Rating**.
* **⚡ Modern UI/UX:** Fully responsive design with a "Netflix-style" Hero section, movie carousels, and smooth animations.
* **🌓 Dark Mode Aesthetic:** Immersive yellow (#F59E0B) and black theme.
* **📱 Interactive Details:** Click any movie to open a modal with full details, backdrops, and related titles.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Shadcn UI
* **Icons:** Lucide React
* **State Management:** React Hooks

### **Backend & ML**
* **API:** FastAPI (Python)
* **Machine Learning:** Scikit-learn (Cosine Similarity / KNN)
* **Data Processing:** Pandas, NumPy
* **Dataset:** MovieLens (ml-latest-small)

---

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### **Prerequisites**
* Node.js (v18+)
* Python (v3.9+)
* Git

### **1. Clone the Repository**
```bash
git clone [https://github.com/pinocchio02/CineScope.git](https://github.com/pinocchio02/CineScope.git)
cd CineScope
```

### 2. Backend Setup (Python API)
Navigate to the root directory (or where `api.py` is located) and install dependencies.

```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required Python packages
pip install fastapi uvicorn pandas numpy scikit-learn python-multipart

# Start the API Server
uvicorn api:app --reload --port 8000
```
The backend will be running at http://127.0.0.1:8000

### 3. Frontend Setup (React)
Open a new terminal and navigate to the frontend folder.

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Development Server
npm run dev
```
The frontend runs at http://localhost:8080 (Vite proxies `/api` to the backend).

---

## Production deployment (Vercel + Render or Railway)

The frontend and backend are deployed separately:

| Part | Host | Notes |
|------|------|--------|
| React app | **Vercel** | Root directory: `frontend` |
| FastAPI API | **Render** or **Railway** | Repo root (`api.py`, `movies_small.csv`) |

### Step 1 — Deploy the API (Render)

1. Push your repo to GitHub (include `movies_small.csv`, ~18 MB).
2. Go to [Render](https://render.com) → **New** → **Blueprint** (or **Web Service**).
3. Connect the repo. **Root directory:** project root (not `frontend/`).
4. Settings:
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Health check path:** `/health`
5. Deploy. First boot loads the CSV and trains the model (1–3 minutes on free tier).
6. Copy the service URL, e.g. `https://cinescope-api.onrender.com`.

**Render alternative:** use the included `render.yaml` (Blueprint deploy).

### Step 1 (alt) — Deploy the API (Railway)

1. [Railway](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Set **Root Directory** to the repo root.
3. Railway reads `railway.toml` / `Procfile` and starts `uvicorn`.
4. Under **Variables**, optional: `DATA_CSV=movies_small.csv`, `MODEL_SIZE=20000`.
5. Copy the public URL from **Settings → Networking → Generate Domain**.

### Step 2 — Point Vercel at the API

1. Vercel project → **Settings** → **Environment Variables**.
2. Add:

   ```
   VITE_API_URL=https://YOUR-RENDER-OR-RAILWAY-URL.onrender.com
   ```

   No trailing slash. Apply to **Production** (and Preview if you want).

3. **Root Directory:** `frontend`
4. Redeploy the frontend.

### Step 3 — Verify

- `https://YOUR-API-URL/health` → `{"status":"ok","movies_loaded":true,...}`
- `https://YOUR-API-URL/home` → JSON with movie categories
- Open your Vercel site → home rows, search, and genres should load.

### Notes

- Do **not** use the old `vercel.json` rewrite to `api.py` — Python does not run on Vercel for this project.
- Free Render/Railway instances **sleep** when idle; the first request after sleep can take 30–60+ seconds.
- `tmdb_movies.csv` (~576 MB) is too large for GitHub; use `movies_small.csv` or run `shrink_data.py` and commit the result.
- For more RAM on small instances, lower `MODEL_SIZE` (e.g. `10000`) in Render/Railway env vars.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/NewFeature`).
3. Commit your changes.
4. Push to the branch and open a Pull Request.

## 👤 Author

**Om Ramani**
* GitHub: [@pinocchio02](https://github.com/pinocchio02)

Made with 🍿 and Python.
