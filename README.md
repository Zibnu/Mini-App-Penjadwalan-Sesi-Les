# 📚 Edufio Mini App — Penjadwalan Sesi Les Privat

Aplikasi web *mobile-first* yang dirancang sebagai *internal administrative tool* untuk Staf Operasional/Admin Edufio dalam mengelola pendaftaran paket les siswa dan mengatur jadwal setiap sesinya secara terstruktur.

---

## 🚀 Cara Menjalankan Aplikasi dari Nol

### Persyaratan Sistem

- Node.js (versi 18+ direkomendasikan)
- npm / pnpm / yarn
- Akun Supabase (Free Tier)

### Langkah Instalasi

1. **Clone Repositori:**

   ```bash
   git clone <URL_REPOSITORI_GIT_ANDA>
   cd edufio-mini-app
   ```

2. **Install Dependensi:**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**

   Buat file `.env` di root directory dan masukkan kredensial Supabase Anda:

   ```env
   VITE_SUPABASE_URL=https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co
   VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
   ```

4. **Setup Database (Supabase):**

   Jalankan skrip SQL yang ada pada file `schema.sql`.

5. **Jalankan Mode Pengembangan:**

   ```bash
   npm run dev
   ```

   Buka `http://localhost:5173` pada browser Anda (gunakan Toggle Device Toolbar / Mobile View pada DevTools).

---

## 🧠 Keputusan Produk & Arsitektur


### 1. Aktor & Batasan Sistem (Internal Admin Tool)

- **Keputusan:** Aplikasi ini khusus digunakan oleh Admin Edufio, bukan oleh orang tua.
- **Alasan:** Komunikasi pendaftaran tetap dilakukan via WhatsApp. Admin memanfaatkan aplikasi ini untuk menggantikan pencatatan manual/spreadsheet agar data entry lebih cepat dan tervalidasi.

### 2. Ruang Lingkup Validasi Bentrok Jadwal (Per-Siswa)

- **Keputusan:** Validasi bentrok waktu dibatasi pada scope **PER-SISWA** (siswa yang sama).
- **Alasan:** Sistem saat ini belum memiliki entitas `Tutor`. Lintas siswa yang berbeda diperbolehkan les di jam yang sama karena ditangani oleh tutor berbeda. Namun, 1 siswa tidak boleh memiliki 2 sesi yang tumpang-tindih.

### 3. Penjadwalan Fleksibel (K ≤ N)

- **Keputusan:** Admin diizinkan menyimpan pendaftaran meskipun jumlah sesi yang dijadwalkan belum memenuhi total paket (K < N).
- **Alasan:** Orang tua murid di lapangan sering kali belum menentukan seluruh tanggal sesi di awal pendaftaran. Aplikasi memberikan penanda visual kuota tersisa (contoh: "2/8 Sesi Terjadwal") agar Admin dapat melengkapinya secara bertahap.

### 4. Batasan Jam Operasional Les (07.00 – 20.00 WIB) & Peringatan Malam

- **Keputusan:** Pilihan jam mulai les dibatasi dari pukul 07.00 hingga 20.00 WIB. Jika sesi dengan durasi tertentu berakhir melewati pukul 20.00 WIB (misal: mulai 19.00 durasi 90 menit → selesai 20.30 WIB), sistem menampilkan warning banner.
- **Alasan:** Memotong opsi time picker 24 jam agar UX lebih efisien, mencegah human error (salah input jam), serta menjaga etika jam belajar anak dan keamanan kunjungan tutor.

### 5. Penetapan Tanggal Minimal H+3 Dinamis

- **Keputusan:** Batas minimal penjadwalan H+3 dihitung secara dinamis dari hari aktual (`current date`) saat Admin melakukan penginputan di aplikasi.
- **Alasan:** Memberikan jeda waktu operasional minimal 3 hari bagi tim Edufio untuk koordinasi pengajar/materi, serta mencegah Admin mendaftarkan sesi di tanggal yang sudah berlalu.