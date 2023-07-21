const baseURL = "http://m.xiangsiyw.cn/";

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

//显示商品列表
function renderGoodsList(arr, page) {
  let waterfall = $(".waterfall");
  if (page == 1) {
    waterfall.html('');
  }
  let loadImages = 0;
  $.each(arr, (index, item) => {

    let waterfallItem = $('<div class="item">').attr("data-goods-id", item.id).appendTo(waterfall);
    waterfallItem.on('click', function () {
      const goodsID = $(this).attr('data-goods-id');
      const invitation_code = getQueryVariable('invitation_code');
      let url = `../pages/goods-detail.html?id=${goodsID}`;
      if (invitation_code) {
        url = `../pages/goods-detail.html?id=${goodsID}&invitation_code=${invitation_code}`;
      }
      const partner_id= getQueryVariable('partner_id');
      if(partner_id){
        url = url+`&partner_id=${partner_id}`;
      }

      location.href = url;
    })

    let waterfallItemContent = $('<div class="item-content">').appendTo(waterfallItem);

    let pic = $('<div class="pic">').appendTo(waterfallItemContent);
    //商品图片
    let cover = $('<img>').attr('src', item.img).appendTo(pic);
    cover.on('load',function(){
      console.log('图片加载完毕');
      loadImages ++;
      if(loadImages === arr.length){
        // setTimeout(() => {
        //   waterfalla();
        // }, 500);
        waterfalla();
      }
    })
    cover.on('error',function(){
      console.log('图片加载失败');
      loadImages ++;
      if(loadImages === arr.length){
        // setTimeout(() => {
        //   waterfalla();
        // }, 500);
        waterfalla();
      }
    })
    // //城市信息
    let cityWrapper = $('<div class="city-wrapper"><i class="icon"></i></div>').appendTo(waterfallItemContent);
    // //城市名称
    $('<span class="city-name">').text(item.city).appendTo(cityWrapper);

    //商品信息
    let goodsInfo = $('<div class="goods-info">').appendTo(waterfallItemContent);
    //商品标题
    $('<h4 class="goods-title">').text(item.title).appendTo(goodsInfo);

    //价格、多少人想要
    let priceWant = $('<div class="price-want">').appendTo(goodsInfo);
    $('<span class="price">').text(`¥ ${item.price}`).appendTo(priceWant);
    $('<span class="want">').text(`${item.desired}人想要`).appendTo(priceWant);

    //用户信息
    let userInfo = $('<div class="user-info">').appendTo(waterfallItemContent);
    //左侧头像及昵称
    let avatarNick = $('<div class="left">').appendTo(userInfo);
    $('<img class="avatar"/>').attr('src', item.avatar).appendTo(avatarNick);
    $('<span class="name">').text(item.nickname).appendTo(avatarNick);
    //右侧等级
    let level = $('<div class="right">').appendTo(userInfo);
    $.each(item.level_img, (index, level_icon) => {
      $('<img>').attr('src', level_icon).appendTo(level);
    })
  });
  // setTimeout(() => {
  //   waterfalla();
  // }, 500);

}

$(function(){
  console.log("render finished");
});

//对商品信息部分的用户昵称等级进行排版
function layoutUserInfo() {
  let userInfoDivWidth = $(".waterfall-item .user-info").width();
  let userInfoLevelWidth = $(".waterfall-item .user-info .right").width();
  let avatarNickWidth = userInfoDivWidth - userInfoLevelWidth - 8;
  let avatarWidth = $(".waterfall-item .user-info .left .avatar").width();
  let nameWidth = avatarNickWidth - avatarWidth - 4;
  $(".waterfall-item .user-info .left .name").css('width', nameWidth + 'px');
}

//瀑布流
function waterfalla() {
  //水平间距
  const HORIZONTAL_SPACING = 10;
  //垂直间距
  // const VERTICAL_SPACING = 10;

  //获取到可视区的宽度
  var clientWidth = $('.waterfall-wrapper').width();
  // console.log(document.documentElement.clientWidth);
  var itemWidth = $('.item').outerWidth();
  //一行可以容纳多少item
  var num = Math.floor(clientWidth / itemWidth);

  //container的宽度
  var containerWidth = num * itemWidth + 6;
  $('.waterfall').css('width', containerWidth + 'px');

  //放置每一列的高度
  var columnHeightArr = [];
  $('.item').each((idx, item) => {

    if (idx < num) {//第一行
      columnHeightArr.push($(item).outerHeight())
    } else {
      //找出高度最低的那一列的值
      var minHeight = Math.min(...columnHeightArr);
      //高度最低的那一列的索引值
      var minIndex = columnHeightArr.indexOf(minHeight);

      $(item).css({
        'position': 'absolute',
        'left': minIndex * itemWidth + 'px',
        'top': minHeight + 'px'
      })
      columnHeightArr[minIndex] = columnHeightArr[minIndex] + $(item).outerHeight();
    }
  });
}
