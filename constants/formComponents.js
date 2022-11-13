const formComponents = [{
    fieldName: '電子郵件地址',
    componentName: '電子郵件地址',
    inputType: 'email'
}, {
    fieldName: '中文姓名',
    componentName: '中文姓名'
}, {
    fieldName: '公司名稱',
    componentName: '公司名稱'
}, {
    fieldName: '部門單位',
    componentName: '部門單位'
}, {
    fieldName: '職稱',
    componentName: '職稱'
}, {
    fieldName: '公司電話與(#分機號碼)',
    componentName: '公司電話與(#分機號碼)',
    inputType: 'tel'
}, {
    fieldName: '手機號碼',
    componentName: '手機號碼',
    inputType: 'tel'
}, {
    fieldName: '午餐為素食或葷食?',
    componentName: '午餐為素食或葷食',
    elements: [{
        elementTitle: '葷食',
        elementName: 'meat-food'
    }, {
        elementTitle: '素食',
        elementName: 'vegetarian-food'
    }, {
        elementTitle: '不用餐',
        elementName: 'none-food'
    }],
    inputType: 'radio'
}, {
    fieldName: '您如何得知本次課程資訊?',
    componentName: '您如何得知本次課程資訊',
    elements: [{
        elementTitle: '官方網站',
        elementName: 'website-info'
    }, {
        elementTitle: 'FB粉絲團',
        elementName: 'fb-info'
    }, {
        elementTitle: 'Youtube',
        elementName: 'yt-info'
    }, {
        elementTitle: '業務人員',
        elementName: 'sales-info'
    }, {
        elementTitle: '電子報',
        elementName: 'newsletter-info'
    }, {
        elementTitle: '其他',
        elementName: 'other-info'
    }],
    inputType: 'radio'
}];

const hasCorssDays = (days) => {
    const news = formComponents.slice();
    news.push({
        fieldName: '您要參與的課程日期? (可複選)',
        componentName: '您要參與的課程日期',
        elements: days.map((day) => {
            return {
                elementTitle: day,
                elementName: `day-${day}`
            };
        }),
        inputType: 'checkbox'
    });

    return news;
};

export { baseFormComponents };