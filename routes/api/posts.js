const express = require('express');
const router = express.Router();
//node request模块安装命令：npm install request
const request = require('request');
const querystring = require('querystring');
const Post = require('../../models/Post');
const User = require('../../models/User');
const cities = require('../../data/cities.json');

// @route   POST api/posts/sms_send
// @desc    发送短信验证码 聚合平台
// @access  Public
router.post('/sms_send1', (req, res) => {
  let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
  const queryData = querystring.stringify({
    mobile: req.body.phone, // 接受短信的用户手机号码
    tpl_id: req.body.tpl_id, // 您申请的短信模板ID，根据实际情况修改
    tpl_value: `#code#=${code}`, // 您设置的模板变量，根据实际情况修改
    key: req.body.key // 应用APPKEY(应用详细页查询)
  });
  const queryUrl = 'http://v.juhe.cn/sms/send?' + queryData;
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
      res.json(jsonObj);
      // 存储
      Post.findOne({ phone: req.body.phone }).then(post => {
        if (!post) {
          new Post({
            phone: req.body.phone,
            code: code
          }).save();
        } else {
          post.code = code;
          post.save();
        }
      });
    } else {
      console.log('请求异常');
      res.json(error);
    }
  });
});

// @route   POST api/posts/code_send
// @desc    发送短信验证码  云之讯平台
// @access  Public
router.post('/sms_send', (req, res) => {
  if (req.body.tpl_id) {
    let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
    const queryData = querystring.stringify({
      mobile: req.body.phone, // 接受短信的用户手机号码
      tpl_id: req.body.tpl_id, // 您申请的短信模板ID，根据实际情况修改
      tpl_value: `#code#=${code}`, // 您设置的模板变量，根据实际情况修改
      key: req.body.key // 应用APPKEY(应用详细页查询)
    });
    const queryUrl = 'http://v.juhe.cn/sms/send?' + queryData;
    request(queryUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
        res.json(jsonObj);
        // 存储
        Post.findOne({ phone: req.body.phone }).then(post => {
          if (!post) {
            new Post({
              phone: req.body.phone,
              code: code
            }).save();
          } else {
            post.code = code;
            post.save();
          }
        });
      } else {
        console.log('请求异常');
        res.json(error);
      }
    });
  } else {
    let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
    const queryData = {
      sid: req.body.sid,
      token: req.body.token,
      appid: req.body.appid,
      templateid: req.body.templateid,
      param: code,
      mobile: req.body.phone
    };
    const queryUrl = `https://open.ucpaas.com/ol/sms/sendsms`;
    request(
      {
        url: queryUrl,
        method: 'POST',
        headers: {
          //设置请求头
          'content-type': 'application/json'
        },
        body: JSON.stringify(queryData)
      },
      function(error, response, body) {
        const jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
        if (jsonObj.code == '000000' && jsonObj.msg == 'OK') {
          res.json(jsonObj);
          // 存储
          Post.findOne({ phone: req.body.phone }).then(post => {
            if (!post) {
              new Post({
                phone: req.body.phone,
                code: code
              }).save();
            } else {
              post.code = code;
              post.save();
            }
          });
        } else {
          console.log('请求异常', error);

          res.json(error);
        }
      }
    );
  }
});

// @route   POST api/posts/sms_back
// @desc    验证短信验证码
// @access  Public
router.post('/sms_back', (req, res) => {
  Post.findOne({ phone: req.body.phone }).then(post => {
    if (post) {
      if (post.code == req.body.code) {
        // res.json({ msg: '验证成功' })
        User.findOne({ phone: req.body.phone }).then(user => {
          if (!user)
            new User({
              phone: req.body.phone
            })
              .save()
              .then(user => res.json({ msg: '验证成功', user }));
          else res.json({ msg: '验证成功', user });
        });
      } else res.status(404).json({ msg: '验证码有误' });
    }
  });
});

// @route   POST api/posts/cities
// @desc    获取城市数据
// @access  Public
router.get('/cities', (req, res) => {
  res.json(cities);
});

module.exports = router;
