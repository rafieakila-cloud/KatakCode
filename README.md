# KatakCode 🐸💻 — Kodok pintar untuk kodinganmu

**KatakCode** adalah PWA asisten AI koding besutan **Buggames Studio**. Langsung jalan **gratis tanpa API key** (Pollinations), atau pakai **API key kamu sendiri** (OpenRouter / Gemini / OpenAI). Semua tersimpan lokal di perangkat kamu.

## ✨ Fitur v1

- 🤖 **Multi-provider** — 🌸 Pollinations (gratis) · 🔀 OpenRouter · ✨ Gemini (dengan **Mode Web / Google Search grounding**) · ○ OpenAI
- 💬 **Chat streaming** (SSE) dengan indikator mengetik maskot **kodok**: melompat (tanya biasa) / mengetik + tekan **ENTER** (tanya kode) / membuka dokumen (ada lampiran)
- 📎 **Lampirkan file kode/dokumen** (.js, .py, .md, …) — kodok baca isinya, tetap dalam konteks chat
- 📁 **Folder Proyek** — tambah seluruh folder, kodok baca struktur & isinya (kode/teks, maks ±40 file / 200 KB) langsung jadi konteks setiap pertanyaan. Jalan di Chrome Android & desktop (`webkitdirectory`)
- 🗂️ **Riwayat chat** tersimpan lokal (IndexedDB), dikelompokkan per tanggal, bisa dibuka/hapus
- 🎤 **Suara** — dikte pertanyaan dengan mic, atau kodok bacakan jawaban (Web Speech API)
- 🔗 **Link card** — URL di jawaban tampil dengan favicon + URL biru; link yang kamu kirim dibaca otomatis (best effort)
- 📝 **Code block** dengan syntax highlight + tombol Salin
- 📱 **Installable PWA** — install di Android dari Chrome, offline untuk app shell

## 🌐 Install di Android

Buka https://rafieakila-cloud.github.io/KatakCode/ → menu ⋮ → **Tambahkan ke layar utama / Install aplikasi**.

## ⚖️ Privasi & kejujuran

- **Tidak ada server KatakCode.** API key kamu disimpan lokal di perangkat dan hanya ditembak langsung ke provider yang kamu pilih.
- **Pollinations gratis** dibatasi ±1 balasan / 45 detik per IP (anon). Untuk pemakaian berat, pakai key gratis Gemini atau OpenRouter.
- **Mode Web** hanya aktif di provider **Gemini** (Google Search grounding) — jawaban selalu terbaru dengan sumber. Pollinations/OpenAI/OpenRouter tidak punya akses web bawaan dari browser.
- Link yang kamu kirim dibaca lewat proxy publik (best effort); kalau gagal, kodok bilang terus terang.

## 🛠️ Tech

Vanilla HTML/CSS/JS · PWA (manifest + service worker) · IndexedDB · Fetch SSE streaming · Web Speech API · Google favicon service · deploy GitHub Pages.

## 📄 Lisensi

MIT · © Buggames Studio
