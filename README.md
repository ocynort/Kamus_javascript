# Kamus JavaScript

Aplikasi referensi JavaScript offline untuk Linux Mint menggunakan Electron. Dirancang untuk membantu pemula mencari keyword, sintaks, konsep, dan method JavaScript.

## Menjalankan aplikasi

Pastikan Node.js dan npm tersedia, lalu jalankan:

```bash
npm install
npm start
```

Data referensi berada di `data/dictionary.json`. Tambahkan objek baru dengan struktur yang sama untuk menambah istilah JavaScript.

## Membuat paket Linux Mint

Untuk membuat installer `.deb`:

```bash
npm run build:deb
```

Hasil build berada di folder `release/`. Setelah paket `.deb` dipasang, Kamus JavaScript akan tersedia di menu aplikasi Linux Mint sebagai launcher desktop.

## Fitur MVP

- Pencarian keyword, sintaks, deskripsi, dan istilah terkait.
- Filter kategori JavaScript.
- Detail sintaks, penjelasan, contoh penggunaan, dan istilah terkait.
- Panduan cara penulisan yang benar serta kesalahan umum.
- Favorit istilah dan riwayat pencarian yang tersimpan secara lokal.
- Kuis JavaScript dengan skor dan progres belajar.
- Playground untuk mengedit dan menjalankan contoh kode JavaScript.
- Berjalan secara offline.

Ikon aplikasi berada di `assets/icon.svg` dan `assets/icon.png`.
