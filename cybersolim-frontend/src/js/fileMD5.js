/**
 * 获取文件的md5
 * https://github.com/satazor/js-spark-md5#readme
 * @author houzhiwei
 * @date 2018/9/29 19:15
 */
import SparkMD5 from "spark-md5";

/**
 * 获取整个文件的 MD5，速度较慢
 * @param uploadFile 上传文件
 * @param chunkSize 分块大小
 * @return {Promise}
 */
function getFileMd5( uploadFile, chunkSize ) {
  return new Promise(( resolve, reject ) => {
    //不能直接使用uploadFile，否则报错 Illegal invocation
    let file = uploadFile.file;
    let spark = new SparkMD5.ArrayBuffer();
    let fileReader = new FileReader();
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    fileReader.onload = e => {
      spark.append(e.target.result);// Append array buffer
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      }
      else {
        uploadFile.uniqueIdentifier = spark.end();  // Compute hash
        resolve();
      }
    };
    fileReader.onerror = e => reject(e);

    let loadNext = () => {
      let start = currentChunk * chunkSize;
      let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    loadNext();

  });
}

/**
 * 结合部分文件块和lastModified时间获取文件MD5，速度较快
 * 不是完整文件的MD5，不能用于做文件比对
 * 方法用于simple-uploader的preProcess中
 * https://github.com/simple-uploader/vue-uploader/issues/15
 * @param uploadFile
 * @param chunkSize
 * @return {Promise}
 */
function getFileMd5WithTime( uploadFile, chunkSize ) {
  return new Promise(( resolve, reject ) => {
    let file = uploadFile.file;
    let spark = new SparkMD5.ArrayBuffer();
    let fileReader = new FileReader();
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    fileReader.onload = e => {
      spark.append(e.target.result);
      if (currentChunk===chunks - 1) {
        // 所有 首尾chunks 完毕 追加lastModifier
        let time = new Int8Array(longToByteArray(file.lastModified));
        spark.append(time);
        uploadFile.uniqueIdentifier = spark.end();
        // uploadFile.md5 = spark.end();
        resolve();
      }
      else {
        // 第一块读完直接读取最后一块
        currentChunk = chunks - 1;
        if (currentChunk <= 0) {
          // 若只分了一块 直接tm组合时间拼接md5
          let time = new Int8Array(longToByteArray(file.lastModified));
          spark.append(time);
          uploadFile.uniqueIdentifier = spark.end();
          // uploadFile.md5 = spark.end();
          resolve();
        }
        else {
          load();
        }
      }
      fileReader.onerror = e => reject(e);
    };

    let load = () => {
      var start = currentChunk * chunkSize
      var end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    };

    load();
  });
}

/*
function generateUniqueIdentifier( file, chunkSize ) {
  return new Promise(( resolve, reject ) => {
    let spark = new SparkMD5.ArrayBuffer();
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    let chunks = Math.ceil(file.size / chunkSize);
    let uniqueIdentifier;
    // 若只分了一块 直接tm组合时间拼接md5
    if (chunks - 1 <= 0) {
      spark.append(blobSlice.call(file, 0, file.size));
      let time = new Int8Array(longToByteArray(file.lastModified));
      spark.append(time);
      uniqueIdentifier = spark.end();
      console.log(uniqueIdentifier);
      resolve(uniqueIdentifier);
    }
    else {
      spark.append(blobSlice.call(file, 0, chunkSize));
      // 第一块读完直接读取最后一块
      spark.append(blobSlice.call(file, (chunks - 1) * chunkSize, file.size));
      // 所有 首尾chunks 完毕 追加lastModifier
      let time = new Int8Array(longToByteArray(file.lastModified));
      spark.append(time);
      uniqueIdentifier = spark.end();
      console.log(uniqueIdentifier);
      resolve(uniqueIdentifier);
    }
  });

}*/
function longToByteArray( long ) {
  // we want to represent the input as a 8-bytes array
  const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let index = 0; index < byteArray.length; index++) {
    const byte = long & 0xff;
    byteArray [index] = byte;
    long = (long - byte) / 256;
  }
  return byteArray;
}

export default {
  getFileMd5,
  getFileMd5WithTime
}
