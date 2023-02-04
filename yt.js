const axios = require("axios")
const cheerio = require("cheerio")

// SRC: https://github.com/ernestoyoofi/express-vercel/blob/main/yt-scrap.js

async function youtubeVideos(name) {
  // Static URL
  const urls = `https://www.youtube.com/@${name}/videos`
  // Fetching <Promise>
  const fetch = await axios.get(urls)
  const $ = cheerio.load(fetch.data)

  // Searching Scripts
  let tors = []
  $("body script").each((i, el) => {
    const texts = $(el).text()
    if(texts?.match("var ytInitialData = ")) {
      tors.push(texts)
    }
  })
  // Get JSON __yt_static
  let __yt_static = JSON.parse(tors[0].slice(20, tors[0].length -1))
  // Tab Video
  let tabVideo = __yt_static.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents
  let video = []
  for(let k of tabVideo) {
    if(k.richItemRenderer) {
      const take_json = k.richItemRenderer.content.videoRenderer
      video.push({
        title: take_json.title?.runs[0].text,
        desc: take_json.descriptionSnippet?.runs[0].text,
        id: take_json.videoId,
        image: take_json.thumbnail.thumbnails[take_json.thumbnail.thumbnails.length - 2],
        publis: take_json.publishedTimeText.simpleText,
        time: take_json.lengthText.simpleText,
        view_count: take_json.viewCountText.simpleText,
        url_video: take_json.navigationEndpoint.watchEndpoint.watchEndpointSupportedOnesieConfig.html5PlaybackOnesieConfig.commonConfig.url
      })
    }
  }
  // Results
  return {
    channel: {
      name: __yt_static.metadata.channelMetadataRenderer.title,
      about: __yt_static.metadata.channelMetadataRenderer.description,
      url: __yt_static.metadata.channelMetadataRenderer.ownerUrls[0],
      extenralId: __yt_static.header.c4TabbedHeaderRenderer.channelId,
      avatar: __yt_static.header.c4TabbedHeaderRenderer.avatar.thumbnails,
      banner: __yt_static.header.c4TabbedHeaderRenderer.banner.thumbnails,
      subs: __yt_static.header.c4TabbedHeaderRenderer.subscriberCountText.accessibility.simpleText
    },
    content: video
  }
}

module.exports = youtubeVideos