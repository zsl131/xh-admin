import fetch from 'dva/fetch';
import { message, notification } from 'antd';
import configApi from './configApi';
import { getLoginUser } from './authUtils';
import { logout, password } from '@/utils/common';
import router from 'umi/router';
import React from 'react';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkDatas(data) {
  //console.log(data);
  if(data.errCode !== "0") {

    showError("error", "["+data.errCode+"]"+data.reason, buildError(data.result));

    //message.error(data.reason, 10); //出现错误时显示 X 秒
  } else {
    return data.result;
  }
}

function buildError(data) {
  if(data.errors) {
   //console.log(data.errors)
    let res = "";
    data.errors.map((err)=> {res += (err.msg+"###"); return res;});
    res+="";
    return res;
  } else {return data.reason;}
}

const Desc = (obj) => {
  //console.log("---->", obj);
  return (
    <div>
      {obj.content?obj.content.split("###").map((msg)=> {
        return (msg?(<p> - {msg}</p>):"")
      }):obj.content}
    </div>
  )
};

function showError(type, msg, content) {
  notification[type]({
    message: msg,
    description: <Desc content={content}/>,
    duration: 6, //X 秒后关闭
  });
}

function checkAuth(data) {
  //console.log(data);
  if(data && data.flag==="0") {
    showError("error", "出现错误", data.message);
    return null;
  }
  if(data && data.needLogin==="1") {
    message.warn(data.message, 2, ()=> {
      logout();
      router.push(configApi.url.login);
    });
  }
  return data;
}

function catchError(error) {
  if(error.message.search("Gateway Timeout")>=0 || error.message.search("Bad Gateway")>=0) {
    message.error("服务端网络异常", 6);
  } else {
    console.log(error)
    message.error("出现错误：" + error.message, 6);
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(apiCode, params, options) {
  let headers = {
    //'auth-token': configApi.authToken,
    'apiCode': apiCode,
  };

  const loginUser = getLoginUser();
  if(loginUser) {
    headers.authToken = loginUser.token;
    headers.userId = loginUser.id;
    headers.username = password(loginUser.username);
    headers.nickname = password(loginUser.nickname);
    headers.isAdminUser = loginUser.isAdmin;
  }

  let defaultOption = {
    method: 'GET',
    headers: headers
  };

  Object.assign(defaultOption, options || {});

  console.log(defaultOption, "---------------request");

  params = password(params);
  //console.log(params)

  let finalUrl = '';
  if(defaultOption.method!=="GET") {
    finalUrl = configApi.api.get;
    defaultOption.body = params;
  } else {
    finalUrl = configApi.api.get+params;
  }

  return fetch(finalUrl, defaultOption)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkDatas)
    .then(checkAuth)
    // .then(data => ({ data }))
    // .catch(err => ({ err }));
    .catch(catchError);
}
