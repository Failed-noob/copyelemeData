const express = require('express');
const router = express.Router();
//node request模块安装命令：npm install request
const request = require('request');
const User = require("../../models/User");
const Order = require("../../models/Order");

// @route   GET api/user/user_info/:user_id
// @desc    根据user_id获取用户信息
// @access  Public
router.get('/user_info/:user_id', (req, res) => {
    User.findOne({ _id: req.params.user_id }).then(user => {
        if (user)
            res.json(user);
        else
            res.status(404).json(err)
    }).catch(err => res.status(404).json(err));
})

// @route   POST api/user/add_address/:user_id
// @desc    新增收获地址
// @access  Public
router.post('/add_address/:user_id', (req, res) => {
    User.findOne({ _id: req.params.user_id }).then(user => {
        user.myAddress.push(req.body)
        user.save().then(user => res.json(user));
    })
})

// @route   POST api/user/edit_address/:user_id
// @desc    编辑收获地址
// @access  Public
router.post('/edit_address/:user_id/:id', (req, res) => {
    User.findOne({ _id: req.params.user_id }).then(user => {
        if (user) {
            user.myAddress.forEach(item => {
                if (item._id == req.params.id) {
                    item.name = req.body.name;
                    item.sex = req.body.sex;
                    item.tag = req.body.tag;
                    item.phone = req.body.phone;
                    item.address = req.body.address;
                    item.bottom = req.body.bottom;
                }
            });
        }

        user.save().then(user => res.json(user));
    });
});

// @route   delete api/user/address/:user_id/:id
// @desc    删除收获地址
// @access  Public
router.delete('/address/:user_id/:id', (req, res) => {
    User.findOne({ _id: req.params.user_id }).then(user => {
        const removeIndex = user.myAddress
            .map(item => item._id)
            .indexOf(req.params.id);
        user.myAddress.splice(removeIndex, 1);
        user.save().then(user => res.json(user));
    });
});

// @route   POST api/user/add_order/:user_id
// @desc    生成新订单
// @access  Public
router.post('/add_order/:user_id', (req, res) => {
    Order.findOne({ user: req.params.user_id }).then(order => {
        if (order) {
            order.orderlist.push(req.body)
            order.save().then(order => res.json(order));
        } else {
            let orderlist = []
            orderlist.push(req.body)
            new Order({
                user: req.params.user_id,
                orderlist: orderlist
            }).save().then(order => res.json(order));
        }
    }).catch(err => res.status(404).json(err));
})

// @route   GET api/user/orders/:user_id
// @desc    查询订单
// @access  Public
router.get('/orders/:user_id', (req, res) => {
    Order.findOne({ user: req.params.user_id }).then(order => {
        res.json(order)
    }).catch(err => res.status(404).json(err));
})

module.exports = router;