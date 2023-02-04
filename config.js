module.exports = {
  file: false,// Ubah ke "true" jika ingin menggunakan configurasi fungsi
  template: ({ yt_id, yt_image, yt_desc, yt_title, yt_username }) => {
    // Template untuk mengirim pesan ke webhook
    // Pelajari → https://discord.com/developers/docs/resources/webhook
    return {
      content: `Hii guys, ${yt_username} upload video baru nich ! \ntonton ya https://youtube.com/watch?v=${yt_id}`
    }
  },
  writeFileSession: async (value) => {
    // Pada bagian atas, ubah "false" ke "true" pada konfigurasi
    // file.write = true
    // Kode untuk memberi menulis file
    // Function disarankan async
  },
  readFileSession: async () => {
    // Pada bagian atas, ubah "false" ke "true" pada konfigurasi
    // file.read = true
    // Kode untuk memberi membaca file
    // Function disarankan async
  }
}