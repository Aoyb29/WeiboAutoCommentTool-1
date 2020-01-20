var weiboAutoCommentTool = (function(){

//评论内容list【可自行修改，注意文本与文本之间用英文字符'和,间隔开】
const contentList = ['#王晰有多迷人# @王晰 爱你[心]','#王晰新歌双鱼# wslwsl@王晰 ','#王晰有多迷人# @王晰 好帅啊！！！','#王晰清唱# 哥哥太帅了！@王晰 ','今天又更加喜欢王晰了@王晰 ','#王晰天赐的声音# 🦊#王晰电子刊# 🦊王晰现场🦊王晰新歌🦊王晰拉麦🦊王晰军港之夜🦊王晰可爱🦊王晰清唱🦊王晰东方之珠🦊王晰摇滚🦊王晰救场🦊王晰重游往昔🦊王晰低音🦊王晰双鱼🦊王晰音域🦊王晰青藏高原🦊王晰采访🦊王晰考古🦊王晰声入人心🦊王晰金钟奖🦊王晰青歌赛 @王晰 ','#王晰天赐的声音# 🦊#王晰电子刊# @王晰 想你[亲亲]','#王晰天赐的声音# 🦊#王晰电子刊# 🦊王晰现场🦊王晰新歌🦊王晰拉麦🦊王晰军港之夜🦊王晰可爱🦊王晰清唱🦊王晰东方之珠🦊王晰救场🦊王晰低音🦊王晰双鱼🦊王晰音域🦊王晰青藏高原🦊王晰采访🦊王晰考古🦊王晰金钟奖🦊王晰青歌赛🦊王晰牛逼 @王晰  ','王晰为什么这么可爱[抓狂]','晰晰多发自拍呗[可怜]@王晰 ','#王晰天赐的声音# @王晰 哥哥超棒！[憧憬]','#王晰天赐的声音# @王晰 哥哥辛苦啦[心]','#王晰电子刊# @王晰 签售会，二巡见鸭~','#王晰天赐的声音# @王晰 哥哥，自拍 vlog 小剧场 吃播可以安排吗[可怜]','#王晰电子刊#','#王晰唱新不了情#','💟💟💟💟💟💟💟💟💟💟💟💟💟💟  💟✨✨🎻王晰✨ 绝美男低🎻✨✨💟  💟✨✨✨♈️人间低音炮♈️✨✨✨💟  💟✨✨金钟奖 🥇🏆🥇青歌赛✨✨💟  💟✨✨✨ #王晰天赐的声音#✨✨ 💟  💟💟💟💟💟💟💟💟💟💟💟💟💟💟',' 🔶⚪️🔶⚪️🔶🎻王晰🎻🔶⚪⚪⚪🔶 🔶⚪🔶⚪️🔶🎻王晰🎻⚪️🔶⚪️🔶⚪️ 🔶⚪️🔶⚪️🔶🎻王晰🎻⚪️⚪️🔶⚪️⚪️ 🔶⚪️🔶⚪🔶🎻王晰🎻⚪️🔶⚪️🔶⚪️ 🔶🔶🔶🔶🔶🎻王晰🎻🔶⚪️⚪️⚪️🔶',' 🔴⚪️🔴⚪️🔴🎻王晰🎻🔴⚪⚪⚪🔴 🔴⚪🔴⚪️🔴🎻王晰🎻⚪️🔴⚪️🔴⚪️ 🔴⚪️🔴⚪️🔴🎻王晰🎻⚪️⚪️🔴⚪️⚪️ 🔴⚪️🔴⚪🔴🎻王晰🎻⚪️🔴⚪️🔴⚪️ ⚪🔴⚪🔴⚪🎻王晰🎻🔴⚪️⚪️⚪️🔴'];
var running = false;
var defaultOption = {
//评论间隔时间
delay: 20*1000,
//评论内容
content: '从列表中随机抽取',
//每轮评论个数
count: 27,
//每轮评论间隔,默认为2分钟
interval: 2*60*1000,
//评论总轮数
outCount: 8
};
var needCommentIdList = [];
var commentedIdList = [];
var dateFormat = function (fmt,date){
var o = {
"M+" : date.getMonth()+1, //月份
"d+" : date.getDate(), //日
"h+" : date.getHours(), //小时
"m+" : date.getMinutes(), //分
"s+" : date.getSeconds(), //秒
"q+" : Math.floor((date.getMonth()+3)/3), //季度
"S" : date.getMilliseconds() //毫秒
};
if(/(y+)/.test(fmt))
fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
for(var k in o)
if(new RegExp("("+ k +")").test(fmt))
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
return fmt;
}
var logger = function(msg){
console.log(dateFormat('yyyy-MM-dd hh:mm:ss', new Date()) + ": " + msg);
};
var comment = function(id){
console.log("----------------------------------------->");
logger("Commenting " + id);
var feedItem = document.querySelector('div[mid="' + id + '"]');
var commentButton = feedItem.querySelector('a[action-type="fl_comment"]');
//没有打开的话，模拟点击打开
if(commentButton.parentNode.className != "curr") {
commentButton.click();
logger("Comment list is not loaded, start loading...");
}
logger("Waiting comment list loading...");
//等待评论框出现
setTimeout(function(){
var textArea = feedItem.querySelector('.W_input');
let commentContent = contentList[Math.floor(contentList.length*Math.random())];
textArea.value = commentContent;
//console.log(commentContent);
var sendButton = feedItem.querySelector('.W_btn_a');
sendButton.click();
logger("Sending comment content completed.");
//折叠起来
commentButton.click();
commentedIdList.push(dateFormat('yyyy-MM-dd hh:mm:ss', new Date()) + ' : '+ commentContent);
console.log("<-----------------------------------------");
}, 3000);
};
var commentThread = function(id){
logger("Comment thread started.");
let count = 0;
var innerAction = function(){
//var id = needCommentIdList.shift();
if(id) {
comment(id);
} else {
logger("WARNING: No feed to process...");
}
setTimeout(function(){
//评论27次后自动停止
if(!running || count >= defaultOption.count) {
logger("Comment thread action stoped, exit.");
return;
}
innerAction();
count ++;
}, defaultOption.delay);
};
innerAction();
};
this.start = async function(op){
needCommentIdList = [];
commentedIdList = [];
logger("WeiboAutoCommentTool start running...");
if(typeof(op) !== "undefined") {
defaultOption.delay = op.delay || defaultOption.delay;
defaultOption.content = op.content || defaultOption.content;
defaultOption.id = op.id || defaultOption.id;
defaultOption.count = op.count || defaultOption.count;
defaultOption.interval = op.interval || defaultOption.interval;
defaultOption.outCount = op.outCount || defaultOption.outCount;
logger("Use option: " + JSON.stringify(defaultOption));
} else {
logger("Use default option: " + JSON.stringify(defaultOption));
}
logger("WeiboAutoCommentTool running now.");
//每10min循环一次，循环20次
running = true;
let outCount = defaultOption.outCount;
var repeatAction = function(){
if(running) {
commentThread(defaultOption.id);
} else {
logger("WARNING: exsiting!!");
}
setTimeout(function(){
//评论27次后自动停止
if(!running || outCount<=0) {
running = false;
logger("Finish comment, exit.");
return;
}
repeatAction();
outCount --;
}, defaultOption.interval);
};
repeatAction();
//running = true;
//commentThread(defaultOption.id);
};
this.stop = function(){
running = false;
needCommentIdList = [];
logger("User stoped");
};
//统计method待更新
// this.stat = function(){
// logger("Commented list: ");
// console.log(commentedIdList);
// logger("Total commented " + commentedIdList.length);
// };
return this;
})();
weiboAutoCommentTool.start({
delay: 20*1000,
count: 27,
//这里是id【这是晰晰观察小牛的微博id】【之后发布新微博更换下面的数字即可】
id:4462511103776315,
interval: 20*60*1000,
//评论总轮数
outCount: 8
});
