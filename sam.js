var request = require('request');

var options = {};
options.url = 'http://sam.moneybrain.ai:3000/api';
options.json = {

    // name: 'ZCS_GOJI_CANCEL',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    // ],

    // name: 'ZPM_USERSAFE_12',
    // param: [
    //     { key: 'I_CHK_YYMM', val: '199009' },
    //     { key: 'I_CHK_CUST_NO', val: '105831826' },
    //     { key: 'I_ADV_ORD', val: '1' },
    //     { key: 'I_DATA_TYPE', val: 'D' }
    // ],
    // isTable: true

    // name: 'MS_IF_CM0014',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    // ],
    // isTable: true

    // name: 'MS_IF_CM0013',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    // ],

    // name: 'ZBI_MS_GOJI_RESEND',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    // ],

    // name: 'ZCS_CB_COMMON_ACCINFO',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    // ],
    // isTable: true

    // name: 'ZCS_CHECK_NOTI_AMT',
    // param: [
    //     { key: 'I_VKONT', val: '109107846' },
    // ],
    // isTable: true


    // name: 'ZCS_ARS_PAYMENT',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    //     { key: 'I_HPNUM', val: '01088588151' },
    //     { key: 'I_BETRWP', val: '0' },
    // ]

    // name: 'ZBI_MS_GOJI_LIST',
    // param: [
    //     { key: 'I_VKONT', val: '000110591507' },
    //     { key: 'I_GUBUN', val: '1' },
    // ],
    // isTable: true

    // name: 'ZFC_MS_PAYMENT',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    //     { key: 'I_GUBUN', val: '1' },
    // ],
    // isTable: true

    // name: 'ZCS_CB_COMMON_ACCCRE',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    //     { key: 'I_BANKK', val: '081' }
    // ],

    // name: 'ZCS_CENTER_INFO',
    // param: [
    //     { key: 'I_DONG', val: '구운동' },
    // ],
    // isTable: true


    // name: 'ZCS_EXPIRE_SO',
    // param: [
    //     { key: 'I_VKONT', val: '110591507' },
    // ],

    // name: 'ZCS_GET_PAYMENT_METHOD',
    // param: [
    //     { key: 'I_VKONT', val: '110591507' },
    // ],

    // name: 'ZCS_GOJI_CANCEL',
    // param: [
    //     { key: 'I_VKONT', val: '110591507' },
    // ],


    // name: 'ZCS_GOJI_EMAIL_REQUEST',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' },
    //     { key: 'I_EMAIL', val: '5709psy@moneybrain.ai' }
    // ],

    // name: 'ZCS_GOJI_LMS_REQUEST',
    // param: [
    //     { key: 'I_VKONT', val: '1105391507' },
    //     { key: 'I_HPNUM', val: '01030302811' },
    // ],

    // name: 'ZCS_GOJI_KKOPAY_REQUEST',
    // param: [
    //     { key: 'I_VKONT', val: '110591507' },
    //     { key: 'I_HPNUM', val: '01088588151' },
    // ],

    // name: 'ZCS_GOJI_TYPE_INFO',
    // param: [
    //     { key: 'I_VKONT', val: '105831826' }
    // ],


    name: 'ZCS_CUSTOMER_INFO',
    param: [
        { key: 'I_NAME', val: '차민숙' },
        { key: 'I_BIRTH', val: 'd691018' },
        { key: 'I_PHONE', val: '01077391429' }
    ],
    isTable: true

};

request.post(options, function(err, response, body)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log('@@@@@@@@@');
        console.log(JSON.stringify(body, null, 4));

    }
});
