﻿'use strict';

var _gCitys = [
    { p: '北京', pt: '市', c: ['东城', '西城', '崇文', '宣武', '朝阳', '海淀', '丰台', '石景山'], ct: '区' },
    { p: '上海', pt: '市', c: ['宝山', '金山', '南市', '长宁', '静安', '青浦', '崇明', '卢湾', '松江', '奉贤', '浦东', '杨浦', '虹口', '普陀', '闸北', '黄浦', '闵行', '徐汇', '嘉定', '南汇'], ct: '区' },
    { p: '重庆', pt: '市', c: ['渝中', '江北', '沙坪坝', '南岸', '九龙坡', '大渡口'], ct: '区' },
    { p: '天津', pt: '市', c: ['和平', '河北', '河西', '河东', '南开', '红桥', '塘沽', '汉沽', '大港', '东丽', '西青', '津南', '北辰', '武清', '滨海'], ct: '区' },
    { p: '广东', c: ['广州', '深圳', '珠海', '中山', '佛山', '东莞', '清远', '肇庆', '阳江', '湛江', '韶关', '惠州', '河源', '汕尾', '汕头', '梅州'] },
    { p: '河北', c: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '张家口', '承德', '廊坊', '沧州', '保定', '衡水'] },
    { p: '山西', c: ['太原', '大同', '阳泉', '朔州', '长治', '临汾', '晋城'] },
    { p: '内蒙古', pt: '自治区', c: ['呼和浩特', '包头', '乌海', '临河', '东胜', '集宁', '锡林浩特', '通辽', '赤峰', '海拉尔', '乌兰浩特'] },
    { p: '辽宁', c: ['沈阳', '大连', '鞍山', '锦州', '丹东', '盘锦', '铁岭', '抚顺', '营口', '辽阳', '阜新', '本溪', '朝阳', '葫芦岛'] },
    { p: '吉林', c: ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边'] },
    { p: '黑龙江', c: ['哈尔滨', '齐齐哈尔', '牡丹江', '佳木斯', '大庆', '伊春', '黑河', '鸡西', '鹤岗', '双鸭山', '七台河', '绥化', '大兴安岭'] },
    { p: '江苏', c: ['南京', '苏州', '无锡', '常州', '镇江', '连云港 ', '扬州', '徐州 ', '南通', '盐城', '淮阴', '泰州', '宿迁'] },
    { p: '浙江', c: ['杭州', '湖州', '丽水', '温州', '绍兴', '舟山', '嘉兴', '金华', '台州', '衢州', '宁波'] },
    { p: '安徽', c: ['合肥  ', '芜湖 ', '蚌埠 ', '滁州 ', '安庆 ', '六安 ', '黄山 ', '宣城 ', '淮南 ', '宿州 ', '马鞍山 ', '铜陵', '淮北 ', '阜阳 ', '池州 ', '巢湖 ', '亳州'] },
    { p: '福建', c: ['福州 ', '厦门 ', '泉州 ', '漳州 ', '龙岩 ', '南平 ', '宁德 ', '莆田 ', '三明'] },
    { p: '江西', c: ['南昌', '景德镇', '九江', '萍乡', '新余', '鹰潭', '赣州', '宜春', '吉安', '上饶', '抚州'] },
    { p: '山东', c: ['济南', '青岛', '淄博', '德州', '烟台', '潍坊', '济宁', '泰安', '临沂', '菏泽', '威海', '枣庄', '日照', '莱芜', '聊城', '滨州', '东营'] },
    { p: '河南', c: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '周口', '驻马店', '信阳', '济源'] },
    { p: '湖北', c: ['武汉', '黄石', '十堰', '荆州', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '黄冈', '咸宁', '恩施', '随州', '仙桃', '天门', '潜江', '神农架'] },
    { p: '湖南', c: ['长沙', '株州', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '郴州', '益阳', '永州', '怀化', '娄底', '湘西'] },
    { p: '广西', pt: '自治区', c: ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '贺州', '百色', '河池'] },
    { p: '海南', c: ['海口 ', '三亚', '通什', '琼海', '琼山', '文昌', '万宁', '东方', '儋州'] },
    { p: '四川', c: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充  ', '宜宾', '广安', '达川', '巴中', '雅安', '眉山  ', '阿坝 ', '甘孜 ', '凉山'] },
    { p: '贵州', c: ['贵阳 ', '六盘水', '遵义', '铜仁', '毕节', '安顺', '黔西南 ', '黔东南', '黔南'] },
    { p: '云南', c: ['昆明', '东川', '曲靖', '玉溪', '昭通', '思茅', '临沧', '保山', '丽江', '文山 ', '红河 ', '西双版纳 ', '楚雄 ', '大理 ', '德宏 ', '怒江', '迪庆'] },
    { p: '西藏', pt: '自治区', c: ['拉萨', '那曲', '昌都', '山南', '日喀则', '阿里', '林芝'] },
    { p: '陕西', c: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '商洛', '安康'] },
    { p: '甘肃', c: ['兰州', '金昌', '白银', '天水', '嘉峪关', '定西', '平凉', '庆阳', '陇南', '武威', '张掖', '酒泉', '甘南 ', '临夏'] },
    { p: '青海', c: ['西宁', '海东', ' 海北 ', '黄南', '海南', '果洛', '玉树', '海西'] },
    { p: '宁夏', pt: '自治区', c: ['银川', '石嘴山', '银南', '固原'] },
    { p: '新疆', pt: '自治区', c: ['乌鲁木齐', '克拉玛依', '石河子', '吐鲁番', '哈密', '和田', '阿克苏', '喀什', '克孜勒苏', '巴音郭楞', '昌吉', '博尔塔拉', '伊犁'] },
    { p: '香港', pt: '特区', c: [] },
    { p: '澳门', pt: '特区', c: [] },
    { p: '台湾', c: [] }
];
var _gCurrCateId = 'overview';
var _gCurrCateObj = null;
var _gCategory = [
    {
        id: 'overview', icon: 'fa-chess', text: '课程', atta: '', sub: [
            //{
            //    id: 'Honor',
            //    bgColor: 'rgb(236,239,241)',
            //    color: 'rgb(255,192,0)',
            //    icon: 'thumbs-up',
            //    height: 115,
            //    text: '<p class="overview-title-item-text">荣誉墙</p>'
            //}, {
            //    id: 'Course',
            //    bgColor: 'rgb(248,250,251)',
            //    color: 'rgb(117,180,76)',
            //    icon: 'gamepad',
            //    height: 270,
            //    text: '<p class="overview-title-item-text">已完成</p><p class="overview-title-item-data">' + data.course.completed + '/' + data.course.total + '</ｐ><p class="overview-title-item-text">个课程</p>'
            //}, {
            //    id: 'Experience',
            //    bgColor: 'rgb(236,239,241)',
            //    color: 'rgb(77,208,225)',
            //    icon: 'star',
            //    height: 270,
            //    text: '<p class="overview-title-item-text"><span class="overview-title-item-data">' + totalExp + '</span></p><p class="overview-title-item-text">经验值</p>'
            //}, {
            //    id: 'Times',
            //    bgColor: 'rgb(248,250,251)',
            //    color: 'rgb(124,77,255)',
            //    icon: 'clock-o',
            //    height: 270,
            //    text: '<p class="overview-title-item-text">编程<span class="overview-title-item-data">' + totalTime + '</span>小时</p>'
            //}
        ]
    },
    { id: 'homework', icon: 'fa-home', text: '作业', atta: 'bool' },
    { id: 'exam', icon: 'fa-superscript', text: '测试', atta: '' },
    { id: 'message', icon: 'fa-envelope', text: '消息', atta: 'number' },
    { id: 'report', icon: 'fa-chart-line', text: '报表', atta: '' },
    { id: 'settings', icon: 'fa-user-cog', text: '设定', atta: '' },
    { id: 'workplatform', icon: 'fa-helicopter', text: 'App Studio', atta: '' },
    { id: 'appshop', icon: 'fa-shopping-cart', text: 'App Shop', atta: '' },
    { id: 'teamsuit', icon: 'fa-users', text: 'Team Suit', atta: '' }
];

function initPage() {
    globalResize();
    showLoadingMask();
    buildCategorys();
    initEvents();
    initData();
};

function initEvents() {
    $(window).resize(globalResize);
};

function globalResize() {
    var header = $('header');
    var footer = $('footer');
    $('.col-content').height($('.main-container').height() - header.height() - footer.height());
};

function showLoadingMask() {
    $('#mask_Page_Loading .loader').height('99%').height('100%');
    $('#mask_Page_Loading .loader').width('99%').width('100%');
    var mask = $('#mask_Page_Loading');
    mask.css('display', 'flex');
    mask.css('visibility', 'visible');
    //mask.css('top', $('#wrap_Category_Title').offset().top);
    //mask.css('left', $('#wrap_Category_Title').offset().left);
    //mask.height($('body').height() - $('#wrap_Category_Title').offset().top);
    //mask.width(Math.min($('body').width(), $('body')[0].scrollWidth) - $('#wrap_Category_Title').offset().left);
    //mask.css('top', '0px');
    //mask.css('left', ($('#sideBar_Page_Left').width()) + 'px');
    //mask.height($('#sideBar_Page_Left').height());
    //mask.width($('.main-content-row').width() - $('#sideBar_Page_Left').width());
    //mask.show();
    //mask.css('diaplay', 'flex !important');
    //mask.css('visibility', 'visible');
};

function hideLoadingMask() {
    $('#mask_Page_Loading').fadeOut(500, function () {
        var mask = $('#mask_Page_Loading');
        mask.width(0);
        mask.height(0);
        mask.hide();
        mask.css('visibility', 'hidden');
        mask.css('display', 'none');
    });
};

function buildCategorys() {
    var tmpHTMLArr = [];
    var activeCls = '';
    for (var i = 0; i < _gCategory.length; i++) {
        activeCls = (i == 0 ? 'active-item' : '');
        tmpHTMLArr.push('<div class="row justify-content-start align-items-center row-category-item ' + activeCls + '" data-target="' + _gCategory[i].id + '">');
        tmpHTMLArr.push('   <div class="col-3 text-center">');
        tmpHTMLArr.push('      <i class="fas ' + _gCategory[i].icon + ' category-item-icon" aria-hidden="true"></i>');
        tmpHTMLArr.push('   </div>');
        tmpHTMLArr.push('   <div class="col-9 text-left">');
        tmpHTMLArr.push(_gCategory[i].text);
        if (_gCategory[i].atta != '') {
            tmpHTMLArr.push('       <div class="category-item-attr ' + _gCategory[i].id + '-attr">New</div>');
        }

        tmpHTMLArr.push('   </div>');
        tmpHTMLArr.push('</div>');
        if (_gCategory[i].id == _gCurrCateId) {
            _gCurrCateObj = _gCategory[i];
        }
    }

    $('.wrap-siderbar').append($(tmpHTMLArr.join('')));
};

function buildSubCategory() {
    _gCurrCateObj = _gCurrCateObj == null ? _gCategory[0] : _gCurrCateObj;

};



function initData() {
    var successFn = function (response) {
        hideLoadingMask();
    };

    //ajaxFn('GET', _getRequestURL(_gURLMapping.account.updatepwd, {}), '', successFn);
    successFn();
};