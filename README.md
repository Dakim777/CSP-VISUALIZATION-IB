# 🎓 CSP Visualization - Pembagian Tugas Kelompok

Visualisasi interaktif untuk menyelesaikan Constraint Satisfaction Problem (CSP) menggunakan dua algoritma:
- **Backtracking Search** (Systematic Search)
- **Hill Climbing** (Local Search)

## 📋 Deskripsi Masalah

**Mahasiswa:** Ani, Budi, Citra, Dedi, Eka  
**Kelompok:** K1 dan K2

**Constraint:**
1. **C1:** Ani dan Budi tidak boleh berada di kelompok yang sama
2. **C2:** Citra harus berada di kelompok yang sama dengan Dedi
3. **C3:** Eka tidak boleh sendirian (minimal 1 teman)
4. **C4:** Setiap kelompok harus berisi minimal 2 mahasiswa

## 🚀 Demo

**Live Demo:** [https://dakim777.github.io/CSP-VISUALIZATION-IB/](https://dakim777.github.io/CSP-VISUALIZATION-IB/)

## 🎯 Fitur

- ✅ Visualisasi real-time proses algoritma
- ✅ Perbandingan Backtracking vs Hill Climbing
- ✅ Animasi step-by-step
- ✅ Status constraint checker
- ✅ Statistik iterasi dan backtrack
- ✅ Log detail setiap langkah

## 🛠️ Teknologi

- React.js
- Tailwind CSS
- Lucide React Icons

## 💻 Instalasi & Menjalankan Lokal
```bash
# Clone repository
git clone https://github.com/dakim777/CSP-VISUALIZATION-IB.git
cd CSP-VISUALIZATION-IB

# Install dependencies
npm install

# Jalankan development server
npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📦 Build untuk Production
```bash
npm run build
```

File production akan ada di folder `build/`.

## 🎓 Cara Menggunakan

1. **Pilih Algoritma** - Backtracking Search atau Hill Climbing
2. **Klik Jalankan** - Lihat proses step-by-step
3. **Skip** - Langsung ke hasil akhir (opsional)
4. **Reset** - Mulai dari awal

### Perbedaan Algoritma

| Aspek | Backtracking | Hill Climbing |
|-------|-------------|---------------|
| Jenis | Systematic | Heuristic |
| Kecepatan | Lambat | Cepat |
| Solusi | Semua (6 solusi) | 1 atau 0 |
| Jaminan | Pasti ketemu | Bisa terjebak |

## 📸 Screenshot

*Tambahkan screenshot visualisasi Anda di sini*

## 👨‍💻 Author

**Muhammad Dakim**  
Tugas Kuliah - Kecerdasan Buatan

## 📝 License

MIT License

---

⭐ **Star repository ini jika bermanfaat!**
