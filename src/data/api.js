// 请求需要的api

import api from '../../utils/request.js'

// const headers = {
//     'referer': 'https://www.apple.com.cn'
// }

export const getCityInfo = (p) => api({
    methods: 'get',
    url: 'apis/shop/address-lookup',
    params: p
})

export const getStock = (p)=> api({
    methods: 'get',
    url: 'apis/shop/fulfillment-messages',
    params: p
})