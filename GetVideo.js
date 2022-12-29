const { load } = require("cheerio");
const tiny = require("tinyurl");
const regex = require("./utils");
const superagent = require("superagent");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const extractNumber = (str) => {
  const regex = /^([0-9]+)\D*/g;
  return regex.exec(str)[1];
};

async function GetVideo(url, q = "480") {
  return new Promise(async (resolve, reject) => {
    if ((await regex(url)) == false) {
      reject("Can't See Song ID");
    }
    // const data={
    //    url: url,
    //    q_auto: 0,
    //    ajax: 2
    //  }
    //  const dataString=JSON.stringify(data)

    superagent
      .post("https://www.y2mate.com/mates/en68/analyze/ajax")
      // .send(formData) // sends a JSON post body
      .set("accept", "application/json")
      .field("url", url)
      .field("q_auto", 0)
      .field("ajax", 2)

      .end(async (err, res) => {
        // Calling the end function will send the request
        // console.log('res: ',res.text)
        // console.log('resRes: ',res.text['result'])
        // console.log('resRes: ',JSON.parse(res.text).result)
        // console.log('resRes: ',JSON.stringify(JSON.parse(res.text).result))
        // return
        if (err) {
          console.log(err);
          reject(err);
        }

        const result = JSON.parse(res.text).result.toString();
        // console.log('resRes: ',typeof result)
        // console.log('id: ',/var k__id = "(.*?)"/.exec(result)[1])
        const $ = load(result);
        // console.log('chherio: ',$)
        // console.log('imgsrc: ',$('div[class="thumbnail cover"]'))

        // return
        // const $ = load(res.text['result']);
        let imageSrc = $('div[class="thumbnail cover"]')
            .find("a > img")
            .attr("src"),
          title = $('div[class="caption text-left"]').find("b").text(),
          size = $("div")
            .find("#mp4 > table > tbody > tr > td:nth-child(2)")
            .text(),
          type = $("div")
            .find("#mp4 > table > tbody > tr > td:nth-child(3) > a")
            .attr("data-ftype"),
          quality = $("div")
            .find("#mp4 > table > tbody > tr > td:nth-child(3) > a")
            .attr("data-fquality"),
          id = /var k__id = "(.*?)"/.exec(result)[1];

        // console.log(title, quality);
        // console.log('q: ',q)
        const highestQ = quality;
        quality = extractNumber(quality);
        quality = Number(quality) > Number(q) ? q : quality;

        superagent
          .post("https://www.y2mate.com/mates/en68/convert")
          .set("accept", "application/json")
          .field("type", "youtube")
          .field("v_id", await regex(url))
          .field("_id", id)
          .field("ajax", "1")
          .field("token", "")
          .field("ftype", type)
          .field("fquality", quality)
          .then(async function (body) {
            const resultString = JSON.parse(body.text).result.toString();
            // console.log('resultString: ',resultString)
            const $ = load(resultString);
            let urlDown = $('div[class="form-group has-success has-feedback"]')
              .find("a")
              .attr("href");
            // console.log('urlDown: ',urlDown)
            urlDown = await tiny.shorten(urlDown);
            resolve({
              title,
              size,
              type,
              quality,
              imageSrc,
              urlDown,
              highestQ,
            });
          })
          .catch((err) => {
            reject(err);
          });

        // console.log('err: ',err)
      });

    // promise with then/catch
    // superagent.post('/api/pet').then(console.log).catch(console.error);

    //       const options = {
    //   hostname: 'www.y2mate.com',
    //   // port: 443,
    //   path: '/mates/en68/analyze/ajax',
    //   // path: '/mates/en68',
    //   method: 'POST',
    //   headers: {
    //        'Content-Type': 'multipart/form-data',
    //          // 'Content-Length': dataString.length,

    //      }
    // };

    //       // console.log('formData: ',formData)

    //       const  req = https.request(options, (res) => {
    //     console.log('statusCode:', res.statusCode);
    //     console.log('headers:', res.headers);

    //     res.on('data', (d) => {
    //       console.log('dd: ', d)
    //     });
    // });

    //       req.on('error', (e) => {
    //       console.error(e);
    //     });

    //     req.write(JSON.stringify(formData));
    //     req.end();

    // fetch('https://www.y2mate.com/mates/en423/analyze/ajax',{
    //   method: 'post',
    //   headers: {
    //     'accept': "application/json",
    //     'accept-language': "en-US,en;q=0.9,vi;q=0.8",
    //     'Content-Type': "multipart/form-data"

    //   },
    //   body: JSON.stringify(formData),
    //   // body: formData,

    // })
    // .then(res=>{
    //   // console.log('res: ',res)
    //   return res.body
    // })
    // .then(data=>{
    //   console.log('d: ',data)
    // })

    // axios({
    //   method: 'post',
    //   url: 'https://www.y2mate.com/mates/en423/analyze/ajax',
    //   headers: {
    //     // 'accept': "*/*",
    //     // 'accept-language': "en-US,en;q=0.9,vi;q=0.8",
    //     'content-type': "multipart/form-data"
    //   },
    //   data: {
    //     url: url,
    //     q_auto: 0,
    //     ajax: 2
    //   }
    // }).then(async (res) => {
    //   console.log('res:  ',typeof res.data.result)
    //   return
    //   const $ = load(res.data.result);
    //   const imageSrc = $('div[class="thumbnail cover"]').find('a > img').attr('src'),
    //     title = $('div[class="caption text-left"]').find('b').text(),
    //     size = $('div').find('#mp4 > table > tbody > tr > td:nth-child(2)').text(),
    //     type = $('div').find('#mp4 > table > tbody > tr > td:nth-child(3) > a').attr('data-ftype'),
    //     quality = $('div').find('#mp4 > table > tbody > tr > td:nth-child(3) > a').attr('data-fquality'),
    //     id = /var k__id = "(.*?)"/.exec(res.data.result)[1]
    //     // console.log('q: ',q)

    //     await axios({
    //       method: 'post',
    //       url: 'https://www.y2mate.com/mates/en68/convert',
    //       headers: {
    //         accept: "*/*",
    //         'accept-language': "en-US,en;q=0.9,vi;q=0.8",
    //         'content-type': "multipart/form-data"
    //       },
    //       data:{
    //         type: 'youtube',
    //         v_id: await regex(url),
    //         _id: id,
    //         ajax: '1',
    //         token: '',
    //         ftype: type,
    //         // fquality: quality
    //         fquality: Number(quality)>Number(q)?q:quality
    //       }
    //     }).then(async function (body) {
    //       const $ = load(body.data.result);
    //       var urlDown = $('div[class="form-group has-success has-feedback"]').find('a').attr("href");
    //       urlDown = await tiny.shorten(urlDown);
    //       resolve({
    //         title,
    //         size,
    //         type,
    //         quality,
    //         imageSrc,
    //         urlDown
    //       })
    //     })
    // })
  });
}

module.exports = GetVideo;
