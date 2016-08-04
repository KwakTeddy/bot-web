var templates = {
  "movies": {
    "module": "http",
    "action": "xpathRepeat",
    "url": "http://movie.naver.com",
    "path": "/movie/running/current.nhn?view=list&tab=normal&order=reserve",
    "save": "true",
    "xpath": {
      "repeat": "//ul[@class='lst_detail_t1']/li",
      "limit": "5",
      "doc": {
        "title": "//dt[@class='tit']/a/text()",
        "path": "//dt[@class='tit']/a/@href",
        "director": "//dl[@class='info_txt1']/dd[2]//a/text()",
        "actors": "//dl[@class='info_txt1']/dd[3]//a/text()"
      }
    }
  },

  "movie": {
    "module": "http",
    "action": "xpathByIndex",
    "url": "http://movie.naver.com",
    "xpath": {
      "doc": {
        "title": "//div[@class='mv_info']/h3[@class='h_movie']/a[1]/text()",
        "director": "//dl[@class='info_spec']/dd[2]/p/a/text()",
        "actors": "//dl[@class='info_spec']/dd[3]/p/a/text()",
        "poster_img": "//div[@class='poster']//img/@src"
      }
    }
  },

  "parking": {
    "url": "http://openapi.seoul.go.kr:8088",
    "path": "/5462796a6a636f6d35334e6d736163/json/GetParkInfo/1/5/",
    "preFunction": function(action, botName, user, inJson, outJson, successCallback, errorCallback) {
      outJson.path = template.path + outJson.spot;
    },
    "postFunction": function(action, botName, user, inJson, outJson, successCallback, errorCallback) {

    }
  },

  "products": {"parent": "find", "model": "Product", "fields": "_id title content rate", "docsName": "products", "limit": 3},
  "selectProduct": {"parent": "selectByIndex", "model": "Product", "docsName": "products", "docName": "product"}
};

exports.templates = templates;
