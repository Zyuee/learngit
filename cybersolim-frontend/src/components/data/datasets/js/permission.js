import {vIziToast} from "../../../../js/notify/v-iziToast";
import axios from "axios"

/**
 * 检查用户对数据集、数据文件等的权限
 */
const permission = {
  isDatasetDeletePermitted: function (datasetId)
  {
    axios.get('/delete/checkDatasetPermission', { params: { datasetId: datasetId } }).then(resp => {
      console.log(resp.status===200 && resp.data.status==="OK")
      return resp.status===200 && resp.data.status==="OK";
    }).catch(err => {
      console.log(err);
      vIziToast.error(err);
    });
  },
  isFileDeletePermitted: function (fileId,fileType)
  {
    axios.get('/delete/checkFilePermission', { params: { fileId: fileId,fileType:fileType } }).then(resp => {
      return resp.status===200 && resp.data.status==="OK";
    }).catch(err => {
      console.log(err);
      vIziToast.error(err);
    });
  },
}

export default permission;
