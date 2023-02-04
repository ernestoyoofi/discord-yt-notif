require("dotenv").config()
const ytch = require("./yt")
const configjs = require("./config")
const env = require("process").env
const fs = require("fs").promises
const axios = require("axios")

async function readFiles() {
  if(configjs.file) {
    const data = await configjs.readFileSession()
    return data
  }
  const file_ls = await fs.lstat(`${process.cwd()}/yt-id.txt`)
  if(!file_ls.isFile()) {
    throw new Error("File session not files !")
  }
  const data = await fs.readFile(`${process.cwd()}/yt-id.txt`, {encoding:'utf-8'})
  return data
}

async function writeFiles(value) {
  if(configjs.file) {
    const data = await configjs.writeFileSession(`${value}`)
    return data
  }
  const file_ls = await fs.lstat(`${process.cwd()}/yt-id.txt`)
  if(!file_ls.isFile()) {
    throw new Error("File session not files !")
  }
  const data = await fs.writeFile(`${process.cwd()}/yt-id.txt`, `${value}` , {encoding:'utf-8'})
  return data
}

async function running() {
  const ytdata = await ytch(env.YOUTUBE_TAGS)
  const files = await readFiles()

  const yt_last_video = ytdata.content[0]
  const yt_options = {
    yt_id: yt_last_video.id,
    yt_image: yt_last_video.image.url,
    yt_desc: yt_last_video.desc,
    yt_title: yt_last_video.title,
    yt_username: ytdata.channel.name
  }

  const axiosConfig = {
    url: env.WEBHOOK_IDS,
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    data: JSON.stringify(configjs.template(yt_options))
  }

  if(files != yt_last_video.id) {
    writeFiles(yt_options.yt_id)
    axios(axiosConfig)
    .then(_a => {
      console.log("Kirim notifikasi video baru !")
    })
    .catch(err => {
      console.error("Ada yang bermasalah !")
    })
  } else {
    console.log("Belum ada video baru")
  }
}

async function checkRunning() {
  const data = await readFiles()
  if(!data) {
    const yt = await ytch(env.YOUTUBE_TAGS)
    writeFiles(yt.content[0].id)
  }

  const time = env.TIMEOUT_LOOP
  if(isNaN(time)) {
    throw new Error("Harap format 'TIMEOUT_LOOP' berupa angka")
  }
  if(Number(time) < 2) {
    console.log("Terlalu cepat untuk melakukan permintaan !")
  }
  const setInTime = 1000*60*Number(time)
  console.log("Menuggu sekitar...", setInTime)
  setInterval(() => {
    running()
  }, setInTime)
}
checkRunning()