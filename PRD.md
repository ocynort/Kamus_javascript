# Product Requirements Document (PRD)

## 1. Informasi Produk

| Item | Detail |
| --- | --- |
| Nama produk | Kamus JavaScript |
| Platform | Desktop Linux Mint |
| Status | MVP |
| Bahasa antarmuka | Bahasa Indonesia |
| Target pengguna | Pemula yang sedang belajar JavaScript |

## 2. Ringkasan Produk

Kamus JavaScript adalah aplikasi desktop offline untuk membantu pemula memahami keyword, sintaks, konsep, dan method JavaScript. Pengguna dapat mencari istilah seperti `const`, `function`, `map()`, atau `async/await`, lalu melihat sintaks, penjelasan sederhana, contoh kode, dan istilah terkait.

## 3. Masalah yang Ingin Diselesaikan

Pemula JavaScript sering mengetahui nama sintaks tetapi kesulitan memahami:

- kapan sintaks tersebut digunakan;
- bentuk penulisan yang benar;
- perbedaan antara keyword yang mirip, seperti `let` dan `const`;
- contoh kode yang sederhana dan mudah dicoba.

Aplikasi ini menyediakan referensi singkat yang dapat dicari dengan cepat dan tetap dapat digunakan tanpa internet.

## 4. Tujuan Produk

1. Memudahkan pengguna menemukan keyword dan sintaks JavaScript.
2. Menjelaskan konsep menggunakan bahasa Indonesia yang sederhana.
3. Menyediakan contoh kode yang bisa langsung dipelajari.
4. Membantu pengguna membangun kebiasaan belajar JavaScript secara mandiri.
5. Menyediakan data lokal yang mudah diperluas.

## 5. Sasaran Pengguna

### Pengguna utama

Pemula yang baru mempelajari JavaScript, HTML, CSS, atau pembuatan aplikasi desktop/web.

### Kebutuhan pengguna

- mencari arti keyword JavaScript;
- mencari contoh penulisan sintaks;
- memahami istilah teknis dalam bahasa Indonesia;
- membandingkan istilah yang berkaitan;
- belajar sedikit demi sedikit tanpa membuka internet.

## 6. Ruang Lingkup MVP

### Termasuk

- Pencarian berdasarkan nama istilah, alias, sintaks, deskripsi, dan keyword terkait.
- Daftar entri JavaScript yang tersedia.
- Filter berdasarkan kategori.
- Detail istilah yang berisi sintaks, penjelasan, contoh kode, cara penulisan yang benar, kesalahan umum, dan istilah terkait.
- Data lokal dalam format JSON.
- Tampilan offline untuk Linux Mint.
- Shortcut `Ctrl + K` untuk fokus ke pencarian.

### Kategori MVP

- Keyword dasar: `const`, `let`.
- Function: `function`, arrow function.
- Control flow: `if...else`, `for...of`.
- Array method: `map()`.
- Asynchronous: `async/await`, `Promise`.
- Object dan operator: destructuring, spread operator, optional chaining.

### Tidak termasuk dalam MVP

- Menjalankan kode JavaScript di dalam aplikasi.
- Editor kode lengkap.
- Sinkronisasi cloud atau akun pengguna.
- Kursus JavaScript berurutan.
- Audio atau video pembelajaran.
- Terjemahan dari internet.

## 7. User Stories

1. Sebagai pemula, saya ingin mencari `const` agar memahami cara membuat variabel konstan.
2. Sebagai pemula, saya ingin melihat contoh kode agar dapat meniru pola sintaks yang benar.
3. Sebagai pemula, saya ingin mencari `map()` agar memahami cara mengolah setiap item array.
4. Sebagai pemula, saya ingin memfilter kategori agar dapat belajar satu kelompok konsep pada satu waktu.
5. Sebagai pemula, saya ingin melihat istilah terkait agar dapat mempelajari konsep yang berhubungan.
6. Sebagai pengelola aplikasi, saya ingin menambah entri melalui file JSON agar referensi dapat diperluas.

## 8. Kebutuhan Fungsional

### FR-01 — Memuat data

- Aplikasi memuat data dari `data/dictionary.json` saat dibuka.
- Data dapat digunakan tanpa koneksi internet.
- Jika data gagal dimuat, aplikasi menampilkan pesan kesalahan.

### FR-02 — Pencarian istilah

- Pengguna dapat mencari dengan huruf besar atau kecil.
- Pencarian mencocokkan `term`, `syntax`, `shortDescription`, `explanation`, `related`, dan `keywords`.
- Hasil diperbarui saat pengguna mengetik.
- Jika tidak ada hasil, aplikasi menampilkan pesan yang jelas.

### FR-03 — Daftar hasil

- Setiap hasil menampilkan istilah, kategori, dan ringkasan.
- Jumlah hasil ditampilkan.
- Pengguna dapat memilih satu hasil untuk melihat detail.
- Istilah yang aktif memiliki penanda visual.

### FR-04 — Filter kategori

- Pengguna dapat memilih semua kategori atau satu kategori tertentu.
- Filter dapat digunakan bersamaan dengan pencarian.

### FR-05 — Detail istilah

Detail harus menampilkan:

- nama istilah;
- kategori;
- sintaks umum sebagai pola penulisan yang benar;
- tips aturan penulisan;
- penjelasan bahasa Indonesia;
- contoh kode;
- penjelasan contoh;
- kesalahan umum yang perlu dihindari;
- istilah terkait.

### FR-06 — Shortcut dan pencarian cepat

- `Ctrl + K` memindahkan fokus ke kolom pencarian.
- Tombol pencarian cepat menyediakan contoh seperti `const`, `map()`, dan `async/await`.

### FR-07 — Favorit

- Pengguna dapat menyimpan atau menghapus istilah dari favorit.
- Daftar favorit dapat ditampilkan melalui tab “Favorit”.
- Data favorit disimpan secara lokal dan tetap tersedia setelah aplikasi dibuka kembali.

### FR-08 — Riwayat pencarian

- Pencarian yang dikonfirmasi dengan tombol Enter disimpan sebagai riwayat.
- Maksimal lima pencarian terakhir ditampilkan.
- Pengguna dapat menekan riwayat untuk mengulangi pencarian.

### FR-09 — Kuis JavaScript

- Pengguna dapat memulai kuis dari tombol “Mulai kuis”.
- Setiap sesi terdiri dari maksimal lima soal pilihan ganda.
- Soal meminta pengguna mencocokkan penjelasan dengan istilah JavaScript.
- Setelah menjawab, aplikasi menampilkan jawaban benar dan penjelasan singkat.
- Pengguna dapat mengulangi kuis setelah sesi selesai.

### FR-10 — Progres belajar

- Aplikasi menyimpan jumlah kuis, jawaban benar, total jawaban, dan skor terbaik.
- Panel progres menampilkan persentase akurasi pengguna.
- Progres disimpan secara lokal tanpa akun atau server.

### FR-11 — Playground JavaScript

- Pengguna dapat membuka editor kode dari header atau dari detail istilah.
- Contoh kode pada istilah dapat dimuat langsung ke editor.
- Pengguna dapat mengubah kode dan menjalankannya.
- Output `console.log`, `console.info`, `console.warn`, dan `console.error` ditampilkan di panel console.
- Error syntax/runtime ditampilkan sebagai pesan yang mudah dibaca.
- Eksekusi yang lebih lama dari dua detik dihentikan otomatis.
- Kode dijalankan di Web Worker tanpa akses langsung ke API Node.js Electron.

## 9. Struktur Data

Setiap entri menggunakan struktur berikut:

```json
{
  "term": "const",
  "category": "keyword",
  "shortDescription": "Membuat variabel yang tidak dapat diisi ulang.",
  "syntax": "const nama = nilai;",
  "explanation": "Gunakan const ketika binding variabel tidak akan diganti.",
  "example": "const nama = 'Budi';\nconsole.log(nama);",
  "exampleExplanation": "Variabel nama dibuat sekali lalu digunakan.",
  "writingTips": ["Gunakan nama variabel yang jelas.", "Akhiri statement dengan titik koma jika mengikuti gaya konsisten."],
  "commonMistake": "Jangan mencoba memberi nilai baru ke variabel const.",
  "related": ["let", "variable", "scope"],
  "keywords": ["variabel", "konstan", "declaration"]
}
```

## 10. Kebutuhan Nonfungsional

- Aplikasi harus dapat berjalan offline setelah dependensi terpasang.
- Pencarian lokal harus responsif untuk ribuan entri.
- Antarmuka harus nyaman digunakan pada resolusi minimal 900 × 620 piksel.
- Renderer Electron tidak boleh memiliki akses Node.js langsung.
- Data harus mudah dibaca dan diedit oleh pengembang.
- Contoh kode harus ditampilkan dengan font monospace dan tetap terbaca.
- Setiap entri harus memiliki minimal satu aturan penulisan dan satu kesalahan umum.

## 11. Desain dan Alur Pengguna

### Tampilan utama

1. Header berisi identitas aplikasi dan status offline.
2. Area utama berisi judul, penjelasan, pencarian, dan tombol pencarian cepat.
3. Panel kiri berisi filter kategori dan daftar istilah.
4. Panel kanan berisi detail istilah dan contoh kode.

### Alur belajar

`Buka aplikasi → Cari keyword → Pilih istilah → Baca sintaks → Pelajari contoh → Buka istilah terkait`

### Keadaan yang harus ditangani

- Belum ada istilah yang dipilih.
- Istilah tidak ditemukan.
- Filter tidak menghasilkan entri.
- Data kamus gagal dimuat.

## 12. Teknologi dan Struktur Proyek

- Electron sebagai runtime desktop.
- HTML dan CSS untuk antarmuka.
- JavaScript vanilla untuk logika aplikasi.
- JSON sebagai penyimpanan data MVP.

```text
├── data/dictionary.json
├── index.html
├── main.js
├── preload.js
├── renderer.js
├── styles.css
├── package.json
└── PRD.md
```

## 13. Kriteria Penerimaan MVP

- [ ] `npm install` berhasil dijalankan.
- [ ] `npm start` membuka aplikasi.
- [ ] Daftar istilah tampil saat aplikasi dibuka.
- [ ] Pencarian `const` menampilkan entri `const`.
- [ ] Pencarian `async/await` menampilkan entri asynchronous.
- [ ] Filter `array-method` hanya menampilkan method array.
- [ ] Detail menampilkan sintaks dan contoh kode.
- [ ] Detail menampilkan bagian “Cara penulisan yang benar”.
- [ ] Detail menampilkan bagian “Kesalahan umum”.
- [ ] Aturan penulisan ditampilkan sebagai tips yang mudah dibaca.
- [ ] Kode contoh menggunakan format monospace.
- [ ] Pencarian istilah yang tidak ada menampilkan pesan yang sesuai.
- [ ] Aplikasi dapat digunakan tanpa koneksi internet.
- [ ] Istilah dapat disimpan dan dihapus dari favorit.
- [ ] Favorit tetap tersedia setelah aplikasi dibuka kembali.
- [ ] Riwayat pencarian menampilkan maksimal lima pencarian terakhir.
- [ ] Kuis dapat dimulai, dijawab, dan diulangi.
- [ ] Skor serta akurasi kuis tersimpan secara lokal.
- [ ] Playground dapat dibuka dari header.
- [ ] Contoh kode istilah dapat dimuat ke playground.
- [ ] Kode JavaScript dapat dijalankan dan output console ditampilkan.
- [ ] Error kode ditampilkan tanpa menutup aplikasi.
- [ ] Infinite loop dihentikan otomatis setelah batas waktu.

## 14. Roadmap

### Fase 1 — MVP

- Pencarian keyword dan sintaks.
- Filter kategori.
- Detail dan contoh kode.
- Data JSON lokal.

### Fase 2 — Fitur belajar (aktif)

- Bookmark/favorit istilah.
- Riwayat pencarian.
- Kuis keyword.
- Progress belajar.

### Fase 3 — Playground (aktif)

- Editor kode sederhana dengan contoh istilah.
- Tombol untuk menjalankan kode dalam Web Worker.
- Console output dan pesan error.
- Batas waktu eksekusi untuk mencegah kode macet.

### Fase 4 — Distribusi (selesai)

- Paket `.deb` untuk Linux Mint melalui electron-builder.
- Ikon aplikasi dalam format SVG dan PNG.
- Launcher desktop yang dibuat otomatis saat paket dipasang.
- Script build rilis dan folder output `release/`.
- Paket terverifikasi: `release/kamus-desktop-1.0.0-amd64.deb`.

## 15. Risiko dan Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Penjelasan terlalu sulit untuk pemula | Gunakan contoh kecil dan bahasa nonteknis. |
| Data referensi belum lengkap | Gunakan format JSON yang mudah diperluas. |
| Contoh kode mengandung kesalahan | Validasi contoh secara berkala dengan Node.js. |
| Data terlalu besar untuk JSON | Migrasikan ke database lokal jika diperlukan. |
