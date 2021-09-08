import JSZip from "jszip";
import FileMd5 from "@/js/fileMD5.js";
import {vIziToast} from "@/js/notify/v-iziToast";

//TODO check upload zip file is shapefile or tif

function getBaseName(fileItem) {
  let name = fileItem.name;
  return name.split('.')[0];
}

function checkFormat(dataType) {
  let format = [];
  let msg = "";
  if (dataType.toLowerCase() === "vector") {
    format = ["shp", "shx", "dbf", "prj", "qpj", "sbn", "sbx", "zip"];
    msg = "please select (zipped) shapefile";
  }
  if (dataType.toLowerCase() === "raster") {
    format = ["tif", "tiff", "asc"];// "zip"
    msg = "please select GeoTiff or Grid (asc)";
  }
  if (dataType.toLowerCase() === "csv") {
    format = ["csv"];
    msg = "please select CSV file";
  }
  return {format: format, msg: msg};
}

function zipShapefile(uploader) {
  let fileList = uploader.fileList;
  if (fileList.length === 1 && fileList[0].getExtension() === 'zip') {
    //do nothing
  } else {
    let zip = new JSZip();
    let name = fileList[0].name;
    let basename = name.substring(0, name.indexOf('.'));
    let shps = zip.folder(basename);
    // 不能使用forEach，i 不能从0开始：removeFile 执行时会修改 fileList，造成后面元素下标变化
    for (let i = fileList.length - 1; i >= 0; i--) {
      if (fileList[i].getExtension() !== 'zip') {
        shps.file(fileList[i].name, fileList[i].file, {binary: true});
        uploader.removeFile(fileList[i]);
      }
    }
    shps.generateAsync({type: "blob", compression: 'DEFLATE'}).then(zipped => {
      // convert blob to file
      let file = new File([zipped], basename + '.zip', {
        type: zipped.type,
        lastModified: Date.now()
      });
      uploader.addFile(file);
    });
  }
  /* fileList.forEach((item) => {
     let shpFormats = ["shp", "shx", "dbf", "prj", "qpj", "sbn", "sbx"];
     if (shpFormats.indexOf(item.getExtension()) !== -1) {
       uploader.removeFile(item);
       // item.ignored = true;
     }
   });*/
  /*fileList.forEach((item) => {
    console.log(item.getExtension());
  });*/
  return uploader;
}

function preProcess(chunk, chunkSize) {
  FileMd5.getFileMd5WithTime(chunk.file, chunkSize).then(
    () => {
      chunk.preprocessFinished();
    }
  );
}

function checkChunkUploadedByResponse(chunk, message) {
  let objMessage = {};
  try {
    objMessage = JSON.parse(message);
  } catch (e) {
    console.error(e);
  }
  return (objMessage.uploaded_chunks || []).indexOf(chunk.offset + 1) >= 0;
}

// 处理上传响应

function uploadResp(resp, cb) {
  //resp为字符串
  cb(null, resp); // 必须调用以通知上传组件显示error
  try {
    let respObj = eval("(" + resp + ")");
    if (respObj.status >= 400) {
      vIziToast.error(respObj.errors[0]);
    }
  } catch (err) {
    console.error(err);
  }
}

// 检查一个shapefile是否包含"shp", "shx", "dbf"
function checkShapefile(fileList) {
  let map = new Map();
  let filenames = [];
  fileList.forEach((item, index) => {
    let extension = item.getExtension().toLowerCase();
    let baseName = item.name.toLowerCase().replace("." + extension, "");
    if (filenames.indexOf(baseName) === -1) {
      filenames.push(baseName);
    }
    if (map.has(baseName)) {
      let extensions = map.get(baseName);
      extensions.push(extension);
      map.set(baseName, extensions);
    } else {
      let extensions = [extension];
      map.set(baseName, extensions);
    }
  });
  let msg = [];
  console.debug(filenames);
  // map: filename,[shp,shx,..]
  map.forEach((value, key, map) => {
    if (value.indexOf("zip") > -1) {
      // do nothing
    } else {
      if (value.indexOf("shp") === -1) {
        msg.push('".shp"');
      }
      if (value.indexOf("shx") === -1) {
        msg.push('".shx"');
      }
      if (value.indexOf("dbf") === -1) {
        msg.push('".dbf"');
      }
    }
  });
  return [msg.length, "Shapefile " + filenames.join(", ") + " MUST contain files with extension " + msg.join(", ")];
}

export default {
  getBaseName,
  checkFormat,
  zipShapefile,
  preProcess,
  checkChunkUploadedByResponse,
  uploadResp,
  checkShapefile
}
