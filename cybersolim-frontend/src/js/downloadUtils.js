import axios from "axios";
import {vIziToast} from "./notify/v-iziToast";

/**
 *  download file from server
 * @param method 'post' or 'get'
 * @param url
 * @param data data pass to server
 * @param mimeType e.g., application/zip, text/plain
 */
function downloadFile(method, url, data, mimeType) {
  let config;
  if (data) {
    config = {method: method, url: url, data: data, responseType: 'blob'};
  } else {
    config = {method: method, url: url, responseType: 'blob'};
  }

  axios(config).then((resp) => {
    let data = new Blob([resp.data], {type: mimeType});
    let link = document.createElement('a');
    //default name
    let fileName = resp.headers['filename']; //下载后文件名,需要后台暴露该文件头到 response
    if ('download' in link) { // 非IE下载
      link.download = fileName; //下载后文件名
      link.style.display = 'none';
      link.href = window.URL.createObjectURL(data); //创建下载的链接
      document.body.appendChild(link);
      link.click(); //点击下载
      window.URL.revokeObjectURL(link.href); // 释放URL 对象
      document.body.removeChild(link); //下载完成移除元素
    } else { // IE10+下载
      navigator.msSaveBlob(data, fileName);
    }
  }).catch(err => {
    vIziToast.error(err);
  });
}

export default {
  downloadFile
}
