const express = require('express');
const router = express.Router();
const request = require('request');
const shop = require('../../data/shop.json');
const search = require('../../data/search.json');
const restrant = require('../../data/restrant.json');
const comment = require('../../data/comment.json');

// $route  GET api/profile/batch_shop
// @desc   获取商品信息
// @access private
router.get('/batch_shop', (req, res) => {
    res.json(restrant);
})

// $route  GET api/profile/comments
// @desc   获取商品评价信息
// @access private
router.get('/comments', (req, res) => {
    res.json(comment);
})

// $route  GET api/profile/seller
// @desc   获取商家信息
// @access private
router.get('/seller', (req, res) => {
    res.json({ "brand_intros": [{ "brief": "1954年的美国，美食家James W Mclamore和David Edgerton最初的想法很简单，就是将更多美味，高品质，价格合理的汉堡带给每位顾客，他们想要将火焰烧烤的精华灌注于每一个汉堡中。\n汉堡王主张“真正火烤”的美味享受，精心选用100%纯牛肉饼，在超过300度高温设备上翻烤，快速锁住肉质的汁水，去除多余油腻，散发一种独特的香味，使得每片牛肉饼上都留下一条条独特火烤烤纹烙印。\n明星皇堡诞生于1957年，使用100%牛肉，经过高温火烤，肉质紧实，鲜嫩多汁，加入番茄，酸黄瓜等蔬菜，口感丰富更添美味爽口。8种原料层层叠加，分量十足。作为汉堡王标志性产品，它每年销量超过2.1亿个。", "image_hash": "https://fuss10.elemecdn.com/6/86/9b4a88cbf2d93d90be2baa8fdaf64png.png" }], "header_image": "https://fuss10.elemecdn.com/6/86/9b4a88cbf2d93d90be2baa8fdaf64png.png", "title": "真正火烤，始于1954" });
})

// $route  post api/profile/restaurants/:page/:size
// @desc   上拉加载的接口
// @access private
router.post('/restaurants/:page/:size', (req, res) => {
    // res.json(shop);
    let size = req.params.size;
    let page = req.params.page;
    let index = size * (page - 1);
    let newProfiles = [];
    let profiles = shop.items;
    if (req.body.condition && req.body.condition != '') {
        if (req.body.condition == 'distance' || req.body.condition == 'float_delivery_fee' || req.body.condition == 'order_lead_time' || req.body.condition == 'float_minimum_order_amount')
            profiles.sort(sortBy({ key: req.body.condition, isReverse: true }))
        else
            profiles.sort(sortBy({ key: req.body.condition, isReverse: false }))
    } else if (req.body.code && req.body.code != '') {
        // 过滤
        if (typeof req.body.code == 'string') {
            let newArray = profiles.filter(item => {
                if (item.restaurant[req.body.code])
                    return item
            })
            profiles = newArray
        } else {
            let con = req.body.code.MPI.split(',')
            let newArray = profiles.filter(item => {
                if (item.restaurant[con[0]])
                    return item
            })
            profiles = newArray
        }

    } else {
        profiles = shop.items;
    }
    for (let i = index; i < size * page; i++) {
        if (profiles[i] != null) {
            newProfiles.push(profiles[i]);
        }
    }
    res.json(newProfiles);
})
// 排序
function sortBy(by) {
    let key = by.key,
        isReverse = by.isReverse;
    return function (a, b) {
        if (a.restaurant[key] == b.restaurant[key]) return 0;
        return isReverse ? (Number(a.restaurant[key]) > Number(b.restaurant[key]) ? 1 : -1) : (Number(a.restaurant[key]) < Number(b.restaurant[key]) ? 1 : -1)
    }
}

// $route  GET api/profile/typeahead/:kw
// @desc   根据关键字搜索
// @access private
router.get('/typeahead/:kw', (req, res) => {
    let kw = req.params.kw
    let restaurants = []
    let words = []
    search.restaurants.forEach(element => {
        if (element.name.indexOf(kw) != -1)
            restaurants.push(element)
    });
    search.words.forEach(element => {
        if (element.indexOf(kw) != -1)
            words.push(element)
    });

    res.json({ restaurants, words })
})

/**
 * $route  GET api/profile/shopping
 * @desc   首页轮播数据
 */
router.get('/shopping', (req, res) => {
    res.json({
        swipeImgs: [
            "https://fuss10.elemecdn.com/4/48/37fce9a4ffbec79293357f68ecfcbjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/9c/d8da44b63fa1208476992df88edc9jpeg.jpeg",
            "https://fuss10.elemecdn.com/2/f6/36e52bca0d6db458e9855b7fc5813jpeg.jpeg",
            "https://fuss10.elemecdn.com/7/25/384310fa6b1ab447414ec17e750bbjpeg.jpeg"
        ],
        entries: [
            [
                {
                    name: "美食",
                    image:
                        "https://fuss10.elemecdn.com/7/d8/a867c870b22bc74c87c348b75528djpeg.jpeg"
                },
                {
                    name: "商超便利",
                    image:
                        "https://fuss10.elemecdn.com/c/7e/76a23eb90dada42528bc41499d6f8jpeg.jpeg"
                },
                {
                    name: "水果",
                    image:
                        "https://fuss10.elemecdn.com/0/d0/dd7c960f08cdc756b1d3ad54978fdjpeg.jpeg"
                },
                {
                    name: "医药健康",
                    image:
                        "https://fuss10.elemecdn.com/7/0a/af108e256ebc9f02db599592ae655jpeg.jpeg"
                },
                {
                    name: "浪漫鲜花",
                    image:
                        "https://fuss10.elemecdn.com/3/01/c888acb2c8ba9e0c813f36ec9e90ajpeg.jpeg"
                },
                {
                    name: "跑腿代购",
                    image:
                        "https://fuss10.elemecdn.com/e/58/bceb19258e3264e64fb856722c3c1jpeg.jpeg"
                },
                {
                    name: "汉堡披萨",
                    image:
                        "https://fuss10.elemecdn.com/b/7f/432619fb21a40b05cd25d11eca02djpeg.jpeg"
                },
                {
                    name: "厨房生鲜",
                    image:
                        "https://fuss10.elemecdn.com/c/21/e42997b86b232161a5a16ab813ae8jpeg.jpeg"
                },
                {
                    name: "炸鸡炸串",
                    image:
                        "https://fuss10.elemecdn.com/a/78/0fb469b2da210827ec16896e00420jpeg.jpeg"
                },
                {
                    name: "地方菜系",
                    image:
                        "https://fuss10.elemecdn.com/a/8a/ec21096d528b7cfd23cdd894f01c6jpeg.jpeg"
                }
            ],
            [
                {
                    name: "麻辣烫",
                    image:
                        "https://fuss10.elemecdn.com/e/c7/b7ba9547aa700bd20d0420e1794a8jpeg.jpeg"
                },
                {
                    name: "下午茶",
                    image:
                        "https://fuss10.elemecdn.com/0/1a/314b6da88ab6c7ae9828f91652d40jpeg.jpeg"
                },
                {
                    name: "地方小吃",
                    image:
                        "https://fuss10.elemecdn.com/7/d6/6f2631288a44ec177204e05cbcb93jpeg.jpeg"
                },
                {
                    name: "大牌惠吃",
                    image:
                        "https://fuss10.elemecdn.com/a/7b/b02bd836411c016935d258b300cfejpeg.jpeg"
                },
                {
                    name: "米粉面馆",
                    image:
                        "https://fuss10.elemecdn.com/e/89/185f7259ebda19e16123884a60ef2jpeg.jpeg"
                },
                {
                    name: "包子粥店",
                    image:
                        "https://fuss10.elemecdn.com/5/1a/dc885d2ce022d2ee60495acafb795jpeg.jpeg"
                },
                {
                    name: "速食简餐",
                    image:
                        "https://fuss10.elemecdn.com/d/38/7bddb07503aea4b711236348e2632jpeg.jpeg"
                }
            ]
        ]
    })
})

/**
 * $route  GET api/profile/filter
 * @desc   筛选排序
 */
router.get('/filter', (req, res) => {
    res.json({
        navTab: [
            // 过滤按钮
            {
                name: "综合排序", icon: "caret-down"
            },
            { name: "距离最近", condition: 'distance' },
            { name: "品质联盟", condition: 'is_premium' },
            { name: "筛选", icon: "filter" }
        ],
        sortBy: [
            // 综合排序
            { name: "综合排序", check: false, code: '' },
            { name: "好评优先", check: false, code: 'rating' },
            { name: "销量最高", check: false, code: 'recent_order_num' },
            { name: "起送价最低", check: false, code: 'float_minimum_order_amount' },
            { name: "配送最快", check: false, code: 'order_lead_time' },
            { name: "配送费最低", check: false, code: 'float_delivery_fee' },
            { name: "人均从低到高", check: false, code: '' },
            { name: "人均从高到低", check: false, code: '' },
            { name: "通用排序", check: false, code: '' }
        ],
        screenBy: [
            // 筛选
            {
                title: "商家服务（可多选）",
                id: 'MPI',
                data: [
                    {
                        name: "蜂鸟专送",
                        icon:
                            "https://fuss10.elemecdn.com/b/9b/45d2f6ff0dbeef3a78ef0e4e90abapng.png",
                        select: false,
                        code: 'delivery_mode'
                    },
                    {
                        name: "品牌商家",
                        icon:
                            "https://fuss10.elemecdn.com/6/7c/417ba499b9ef8240b8014a453bf30png.png",
                        select: false,
                        code: 'is_premium'
                    },
                    {
                        name: "新店",
                        icon:
                            "https://fuss10.elemecdn.com/c/93/ded991df780906f7471128a226104png.png",
                        select: false,
                        code: ''
                    },
                    {
                        name: "食安保",
                        icon:
                            "https://fuss10.elemecdn.com/2/cd/444d002a94325c5dff004fb3b9505png.png",
                        select: false,
                        code: ''
                    },
                    {
                        name: "开发票",
                        icon:
                            "https://fuss10.elemecdn.com/3/d4/5668ffc03151826f95b75249bea31png.png",
                        select: false,
                        code: ''
                    }
                ]
            },
            {
                title: "优惠活动（单选）",
                id: 'offer',
                data: [
                    { name: "首单立减", select: false, code: '' },
                    { name: "门店新客立减", select: false, code: '' },
                    { name: "满减优惠", select: false, code: '' },
                    { name: "下单返红包", select: false, code: '' },
                    { name: "进店领红包", select: false, code: '' },
                    { name: "配送费优惠", select: false, code: '' },
                    { name: "赠品优惠", select: false, code: '' },
                    { name: "特价商品", select: false, code: '' },
                    { name: "品质联盟红包", select: false, code: '' }
                ]
            },
            {
                title: "人均消费",
                id: 'per',
                data: [
                    { name: "¥20以下", select: false, code: '' },
                    { name: "¥20-¥40", select: false, code: '' },
                    { name: "¥40-¥60", select: false, code: '' },
                    { name: "¥60-¥80", select: false, code: '' },
                    { name: "¥80-¥100", select: false, code: '' },
                    { name: "¥100以上", select: false, code: '' }
                ]
            }
        ]
    })
})

module.exports = router;